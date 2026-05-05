-- Muavin Raporu (fin-muhasebe-detay) — outer wrapper
-- BRANCH_UNION_THEN_OUTER queryShape: the inner-SQL marker (curly-brace
-- inner) is replaced by SqlBuilder with the multi-year branch UNION ALL.
-- NOTE: Do not write the literal placeholder token anywhere except the single
-- substitution site below — applyTemplates does a global string replace
-- and would inject inner SQL into multi-line comments, breaking them.
--
-- Window functions compute global running balance (bakiye) across all yearly
-- partitions, ordered by (action_date, card_id, card_row_id).
--
-- Final output columns: 26 visible + 6 hidden audit (defined in JSON).
-- Filter pushdown is intentionally NOT done in branches — outer WHERE applies
-- AG Grid filters AFTER bakiye is computed.

SELECT
  q.account_code,
  q.account_name,
  q.action_date,
  q.card_id,
  q.card_row_id,
  q.action_id,
  q.action_type,
  q.action_table,
  q.paper_no,
  q.card_detail,
  q.card_document_type_id,
  q.card_document_type_name,
  q.process_cat,
  q.detail,
  q.company_name,
  q.project_name,
  q.wrk_id,
  q.ba,
  q.ba_code,
  q.amount_currency,
  q.amount_currency_2,
  q.other_amount,
  q.other_currency,
  q.ifrs_code,
  q.account_code2,

  -- TL block
  CAST(CASE WHEN q.ba = 1 THEN q.tl_native_amount END AS decimal(19,4))                AS borc_tl,
  CAST(CASE WHEN q.ba = 0 THEN q.tl_native_amount END AS decimal(19,4))                AS alacak_tl,
  CAST(q.signed_tl AS decimal(19,4))                                                   AS net_tl,
  CAST(SUM(q.signed_tl) OVER (
    PARTITION BY q.account_code
    ORDER BY q.action_date, q.card_id, q.card_row_id
    ROWS UNBOUNDED PRECEDING
  ) AS decimal(19,4))                                                                  AS bakiye_tl,

  -- USD block
  CAST(CASE WHEN q.ba = 1 THEN q.usd_native_amount END AS decimal(19,4))               AS borc_usd,
  CAST(CASE WHEN q.ba = 0 THEN q.usd_native_amount END AS decimal(19,4))               AS alacak_usd,
  CAST(q.signed_usd AS decimal(19,4))                                                  AS net_usd,
  CAST(SUM(q.signed_usd) OVER (
    PARTITION BY q.account_code
    ORDER BY q.action_date, q.card_id, q.card_row_id
    ROWS UNBOUNDED PRECEDING
  ) AS decimal(19,4))                                                                  AS bakiye_usd,

  -- EUR block
  CAST(q.eur_rate AS decimal(19,6))                                                    AS eur_kuru,
  CAST(
    CASE
      WHEN q.ba = 1 AND q.eur_native_amount IS NOT NULL THEN q.eur_native_amount
      WHEN q.ba = 1 AND q.eur_rate IS NOT NULL AND q.tl_native_amount IS NOT NULL
        THEN q.tl_native_amount / q.eur_rate
    END AS decimal(19,4)
  )                                                                                    AS borc_eur,
  CAST(
    CASE
      WHEN q.ba = 0 AND q.eur_native_amount IS NOT NULL THEN q.eur_native_amount
      WHEN q.ba = 0 AND q.eur_rate IS NOT NULL AND q.tl_native_amount IS NOT NULL
        THEN q.tl_native_amount / q.eur_rate
    END AS decimal(19,4)
  )                                                                                    AS alacak_eur,
  CAST(
    CASE
      WHEN q.eur_native_amount IS NOT NULL
        THEN q.eur_native_amount * (CASE WHEN q.ba = 1 THEN 1 ELSE -1 END)
      WHEN q.eur_rate IS NOT NULL AND q.tl_native_amount IS NOT NULL
        THEN (q.tl_native_amount / q.eur_rate) * (CASE WHEN q.ba = 1 THEN 1 ELSE -1 END)
    END AS decimal(19,4)
  )                                                                                    AS net_eur,
  CAST(SUM(
    CASE
      WHEN q.eur_native_amount IS NOT NULL
        THEN q.eur_native_amount * (CASE WHEN q.ba = 1 THEN 1 ELSE -1 END)
      WHEN q.eur_rate IS NOT NULL AND q.tl_native_amount IS NOT NULL
        THEN (q.tl_native_amount / q.eur_rate) * (CASE WHEN q.ba = 1 THEN 1 ELSE -1 END)
    END
  ) OVER (
    PARTITION BY q.account_code
    ORDER BY q.action_date, q.card_id, q.card_row_id
    ROWS UNBOUNDED PRECEDING
  ) AS decimal(19,4))                                                                  AS bakiye_eur,

  -- Audit (visible)
  COALESCE(q.kur_kaynagi, 'MISSING|EUR_RATE_NOT_FOUND')                                AS kur_kaynagi,

  -- Audit (hidden / export-only)
  q.kur_tarihi,
  q.kur_id,
  q.kur_yas_gun,
  q.is_opening_document
FROM (
{inner}
) AS q
