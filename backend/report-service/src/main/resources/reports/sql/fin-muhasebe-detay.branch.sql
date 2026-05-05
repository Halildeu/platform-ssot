-- Muavin Raporu (fin-muhasebe-detay) — yearly branch SQL
-- Spec: docs/reports/muavin-grid-spec.md (gitops PR #360, e5efda3)
-- Codex thread 019df4ed-615c-73d1-b67a-7d0b61cc94df (AGREE)
--
-- Placeholders (replaced by SqlBuilder.applyTemplates):
--   {schema}         workcube_mikrolink_{YEAR}_{companyId}  yearly per-company
--   {companySchema}  workcube_mikrolink_{companyId}         company-only (no year)
--   {companyId}      numeric OUR_COMPANY_ID                 for MONEY_HISTORY company match
--
-- Output is a raw row set (one row per ACCOUNT_CARD_ROWS row, enriched with
-- EUR rate from 8-layer waterfall). Window-based bakiye computed in outer wrapper.

SELECT
  ap.ACCOUNT_CODE                                                    AS account_code,
  ap.ACCOUNT_NAME                                                    AS account_name,
  ac.ACTION_DATE                                                     AS action_date,
  ac.CARD_ID                                                         AS card_id,
  acr.CARD_ROW_ID                                                    AS card_row_id,
  ac.ACTION_ID                                                       AS action_id,
  ac.ACTION_TYPE                                                     AS action_type,
  ac.ACTION_TABLE                                                    AS action_table,
  ac.PAPER_NO                                                        AS paper_no,
  ac.CARD_DETAIL                                                     AS card_detail,
  ac.CARD_DOCUMENT_TYPE                                              AS card_document_type_id,
  acdt.DOCUMENT_TYPE                                                 AS card_document_type_name,
  spc.PROCESS_CAT                                                    AS process_cat,
  acr.DETAIL                                                         AS detail,
  c.FULLNAME                                                         AS company_name,
  p.PROJECT_HEAD                                                     AS project_name,
  ac.WRK_ID                                                          AS wrk_id,
  acr.BA                                                             AS ba,
  CASE WHEN acr.BA = 1 THEN 'B' ELSE 'A' END                         AS ba_code,
  acr.AMOUNT_CURRENCY                                                AS amount_currency,
  acr.AMOUNT_CURRENCY_2                                              AS amount_currency_2,
  acr.OTHER_AMOUNT                                                   AS other_amount,
  acr.OTHER_CURRENCY                                                 AS other_currency,
  acr.IFRS_CODE                                                      AS ifrs_code,
  acr.ACCOUNT_CODE2                                                  AS account_code2,

  -- TL native (decimal cast — float aggregation artefact engelle)
  CAST(
    CASE
      WHEN acr.AMOUNT_CURRENCY IN ('TL','TRY') OR acr.AMOUNT_CURRENCY IS NULL
      THEN acr.AMOUNT
    END AS decimal(19,4)
  )                                                                  AS tl_native_amount,

  -- USD native (dynamic — V1 audit-clean: explicit USD only, no implicit conversion)
  CAST(
    CASE
      WHEN acr.AMOUNT_CURRENCY = 'USD'   THEN acr.AMOUNT
      WHEN acr.AMOUNT_CURRENCY_2 = 'USD' THEN acr.AMOUNT_2
    END AS decimal(19,4)
  )                                                                  AS usd_native_amount,

  -- EUR native (rate fallback için ek)
  CAST(
    CASE
      WHEN acr.AMOUNT_CURRENCY = 'EUR'   THEN acr.AMOUNT
      WHEN acr.AMOUNT_CURRENCY_2 = 'EUR' THEN acr.AMOUNT_2
    END AS decimal(19,4)
  )                                                                  AS eur_native_amount,

  -- Signed amounts (Borç pozitif, Alacak negatif) — outer window'a hazır
  CAST(
    CASE
      WHEN acr.AMOUNT_CURRENCY IN ('TL','TRY') OR acr.AMOUNT_CURRENCY IS NULL
      THEN acr.AMOUNT * (CASE WHEN acr.BA = 1 THEN 1 ELSE -1 END)
    END AS decimal(19,4)
  )                                                                  AS signed_tl,
  CAST(
    CASE
      WHEN acr.AMOUNT_CURRENCY = 'USD' THEN acr.AMOUNT * (CASE WHEN acr.BA = 1 THEN 1 ELSE -1 END)
      WHEN acr.AMOUNT_CURRENCY_2 = 'USD' THEN acr.AMOUNT_2 * (CASE WHEN acr.BA = 1 THEN 1 ELSE -1 END)
    END AS decimal(19,4)
  )                                                                  AS signed_usd,

  -- EUR rate (8-layer waterfall — RATE2 default, RATE1 dummy)
  CAST(rate_pick.eur_rate AS decimal(19,6))                          AS eur_rate,
  rate_pick.kur_kaynagi                                              AS kur_kaynagi,
  rate_pick.rate_date                                                AS kur_tarihi,
  rate_pick.rate_id                                                  AS kur_id,
  CASE
    WHEN rate_pick.rate_date IS NOT NULL
    THEN DATEDIFF(day, rate_pick.rate_date, ac.ACTION_DATE)
  END                                                                AS kur_yas_gun,

  -- Açılış fişi flag (canonical company-scoped lookup primary)
  CASE
    WHEN acdt.DOCUMENT_TYPE LIKE N'%çılış%' OR acdt.DOCUMENT_TYPE LIKE N'%cilis%' THEN 1
    ELSE 0
  END                                                                AS is_opening_document

FROM [{schema}].[ACCOUNT_CARD_ROWS] acr WITH (NOLOCK)
INNER JOIN [{schema}].[ACCOUNT_CARD] ac WITH (NOLOCK)
  ON ac.CARD_ID = acr.CARD_ID
INNER JOIN [{schema}].[ACCOUNT_PLAN] ap WITH (NOLOCK)
  ON LTRIM(RTRIM(ap.ACCOUNT_CODE)) = LTRIM(RTRIM(acr.ACCOUNT_ID))
 AND ap.SUB_ACCOUNT = 0
LEFT JOIN [workcube_mikrolink].[ACCOUNT_CARD_DOCUMENT_TYPES] acdt WITH (NOLOCK)
  ON acdt.DOCUMENT_TYPE_ID = ac.CARD_DOCUMENT_TYPE
 AND acdt.OUR_COMPANY_ID = CAST({companyId} AS nvarchar(20))
LEFT JOIN [{companySchema}].[SETUP_PROCESS_CAT] spc WITH (NOLOCK)
  ON spc.PROCESS_CAT_ID = ac.CARD_CAT_ID
LEFT JOIN [workcube_mikrolink].[PRO_PROJECTS] p WITH (NOLOCK)
  ON p.PROJECT_ID = ac.PROJECT_ID
LEFT JOIN [workcube_mikrolink].[COMPANY] c WITH (NOLOCK)
  ON c.COMPANY_ID = ac.ACC_COMPANY_ID

OUTER APPLY (
  SELECT TOP (1) x.eur_rate, x.kur_kaynagi, x.rate_date, x.rate_id, x.priority
  FROM (

    -- L1: ACCOUNT_CARD_MONEY by CARD_ID (fiş-level manuel override, en otoriter)
    SELECT
      acm.RATE2 AS eur_rate,
      CONCAT('ACM|CARD_ID|RATE2|MID:', acm.ACTION_MONEY_ID) AS kur_kaynagi,
      CAST(NULL AS datetime) AS rate_date,
      acm.ACTION_MONEY_ID AS rate_id,
      10 AS priority
    FROM [{schema}].[ACCOUNT_CARD_MONEY] acm WITH (NOLOCK)
    WHERE acm.ACTION_ID = ac.CARD_ID AND acm.MONEY_TYPE = 'EUR'

    UNION ALL

    -- L2: ACCOUNT_CARD_MONEY by source ACTION_ID (cascade fallback)
    SELECT
      acm2.RATE2,
      CONCAT('ACM|ACTION_ID|RATE2|MID:', acm2.ACTION_MONEY_ID),
      NULL, acm2.ACTION_MONEY_ID, 20
    FROM [{schema}].[ACCOUNT_CARD_MONEY] acm2 WITH (NOLOCK)
    WHERE acm2.ACTION_ID = ac.ACTION_ID AND acm2.MONEY_TYPE = 'EUR'

    UNION ALL

    -- L3: POOL exact ACTION_TABLE match (ACCOUNT_CARD.ACTION_TABLE = pool.action_table)
    -- 13 *_MONEY tables UNION ALL inline; MONEY_TABLES validates dispatch
    SELECT
      pool.RATE2,
      CONCAT('POOL|', pool.action_table, '|RATE2|MID:', pool.action_money_id),
      NULL, pool.action_money_id, 30
    FROM (
      SELECT 'INVOICE_MONEY' AS action_table, ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID AS action_money_id
        FROM [{schema}].[INVOICE_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'EXPENSE_ITEM_PLANS_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{schema}].[EXPENSE_ITEM_PLANS_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'STOCK_FIS_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{schema}].[STOCK_FIS_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'CARI_ACTION_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{schema}].[CARI_ACTION_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'CARI_ACTION_MULTI_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{schema}].[CARI_ACTION_MULTI_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'CREDIT_CONTRACT_PAYMENT_INCOME_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{schema}].[CREDIT_CONTRACT_PAYMENT_INCOME_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'PAYROLL_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{schema}].[PAYROLL_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'BANK_ACTION_MULTI_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{schema}].[BANK_ACTION_MULTI_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'BANK_ACTION_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{schema}].[BANK_ACTION_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'BANK_ORDER_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{schema}].[BANK_ORDER_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'CASH_ACTION_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{schema}].[CASH_ACTION_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'CREDIT_CARD_BANK_EXPENSE_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{companySchema}].[CREDIT_CARD_BANK_EXPENSE_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
      UNION ALL
      SELECT 'TAHAKKUK_PLAN_MONEY', ACTION_ID, MONEY_TYPE, RATE2, IS_SELECTED, ACTION_MONEY_ID
        FROM [{companySchema}].[TAHAKKUK_PLAN_MONEY] WITH (NOLOCK) WHERE MONEY_TYPE = 'EUR'
    ) pool
    INNER JOIN [workcube_mikrolink].[MONEY_TABLES] mt WITH (NOLOCK)
      ON mt.ACTION_TYPE = ac.ACTION_TYPE AND mt.ACTION_TABLE = pool.action_table
    WHERE pool.ACTION_ID = ac.ACTION_ID

    UNION ALL

    -- L5: MONEY_HISTORY same-day, COMPANY_ID matched (current OUR_COMPANY scope)
    SELECT
      mh.RATE2,
      CONCAT('MH|COMPANY|SAME_DAY|RATE2|DATE:', CONVERT(varchar(10), mh.VALIDATE_DATE, 23),
             '|MID:', mh.MONEY_HISTORY_ID),
      mh.VALIDATE_DATE, mh.MONEY_HISTORY_ID, 50
    FROM [workcube_mikrolink].[MONEY_HISTORY] mh WITH (NOLOCK)
    WHERE mh.MONEY = 'EUR'
      AND mh.COMPANY_ID = {companyId}
      AND CAST(mh.VALIDATE_DATE AS date) = CAST(ac.ACTION_DATE AS date)

    UNION ALL

    -- L6: MONEY_HISTORY same-day GLOBAL (COMPANY_ID NULL — Codex order: same-day-global > prev-day-company)
    SELECT
      mh2.RATE2,
      CONCAT('MH|GLOBAL|SAME_DAY|RATE2|DATE:', CONVERT(varchar(10), mh2.VALIDATE_DATE, 23),
             '|MID:', mh2.MONEY_HISTORY_ID),
      mh2.VALIDATE_DATE, mh2.MONEY_HISTORY_ID, 60
    FROM [workcube_mikrolink].[MONEY_HISTORY] mh2 WITH (NOLOCK)
    WHERE mh2.MONEY = 'EUR'
      AND mh2.COMPANY_ID IS NULL
      AND CAST(mh2.VALIDATE_DATE AS date) = CAST(ac.ACTION_DATE AS date)

    UNION ALL

    -- L7: MONEY_HISTORY <=7 day previous, COMPANY_ID matched
    SELECT
      mh3.RATE2,
      CONCAT('MH|COMPANY|PREV_DAY|RATE2|DATE:', CONVERT(varchar(10), mh3.VALIDATE_DATE, 23),
             '|AGE:', DATEDIFF(day, mh3.VALIDATE_DATE, ac.ACTION_DATE),
             '|MID:', mh3.MONEY_HISTORY_ID),
      mh3.VALIDATE_DATE, mh3.MONEY_HISTORY_ID, 70
    FROM [workcube_mikrolink].[MONEY_HISTORY] mh3 WITH (NOLOCK)
    WHERE mh3.MONEY = 'EUR'
      AND mh3.COMPANY_ID = {companyId}
      AND mh3.VALIDATE_DATE < ac.ACTION_DATE
      AND mh3.VALIDATE_DATE >= DATEADD(day, -7, ac.ACTION_DATE)

    UNION ALL

    -- L8: MONEY_HISTORY <=7 day previous, GLOBAL
    SELECT
      mh4.RATE2,
      CONCAT('MH|GLOBAL|PREV_DAY|RATE2|DATE:', CONVERT(varchar(10), mh4.VALIDATE_DATE, 23),
             '|AGE:', DATEDIFF(day, mh4.VALIDATE_DATE, ac.ACTION_DATE),
             '|MID:', mh4.MONEY_HISTORY_ID),
      mh4.VALIDATE_DATE, mh4.MONEY_HISTORY_ID, 80
    FROM [workcube_mikrolink].[MONEY_HISTORY] mh4 WITH (NOLOCK)
    WHERE mh4.MONEY = 'EUR'
      AND mh4.COMPANY_ID IS NULL
      AND mh4.VALIDATE_DATE < ac.ACTION_DATE
      AND mh4.VALIDATE_DATE >= DATEADD(day, -7, ac.ACTION_DATE)

  ) x
  WHERE x.eur_rate IS NOT NULL
  ORDER BY x.priority ASC, x.rate_date DESC, x.rate_id DESC
) rate_pick

WHERE ISNULL(ac.IS_CANCEL, 0) = 0
