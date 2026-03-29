"""Technique 3: Match aliased/abbreviated column names to target tables."""
import logging
from ..connectors.base import TableInfo

logger = logging.getLogger(__name__)

# Known alias patterns: {column_name: target_table}
ALIAS_MAP = {
    # Company aliases
    "COMP_ID": "COMPANY",
    "CMP_ID": "COMPANY",
    "ACC_COMPANY_ID": "COMPANY",
    "SALES_COMPANY_ID": "COMPANY",
    "TO_COMPANY_ID": "COMPANY",
    "CARRIER_COMPANY_ID": "COMPANY",
    "FUEL_COMPANY_ID": "COMPANY",
    "OLD_COMPANY_ID": "COMPANY",
    "FROM_CMP_ID": "COMPANY",
    "TO_CMP_ID": "COMPANY",
    "CH_COMPANY_ID": "COMPANY",
    "SUP_COMPANY_ID": "COMPANY",
    "OUR_CMP_ID": "OUR_COMPANY",
    # Employee aliases
    "EMP_ID": "EMPLOYEES",
    "ACC_EMPLOYEE_ID": "EMPLOYEES",
    "BASKET_EMPLOYEE_ID": "EMPLOYEES",
    "CC_EMP_ID": "EMPLOYEES",
    "VALID_EMPLOYEE_ID": "EMPLOYEES",
    "SSK_EMPLOYEE_ID": "EMPLOYEES",
    "RESP_EMP_ID": "EMPLOYEES",
    "DATA_OFFICER_ID": "EMPLOYEES",
    "PROJECT_EMP_ID": "EMPLOYEES",
    "SERVICE_EMPLOYEE_ID": "EMPLOYEES",
    "MANAGER_ID": "EMPLOYEES",
    "SECOND_BOSS_ID": "EMPLOYEES",
    "THIRD_BOSS_ID": "EMPLOYEES",
    "FOURTH_BOSS_ID": "EMPLOYEES",
    "FIFTH_BOSS_ID": "EMPLOYEES",
    "FIRST_BOSS_ID": "EMPLOYEES",
    # Department / Branch aliases
    "DEPT_ID": "DEPARTMENT",
    "ACC_DEPARTMENT_ID": "DEPARTMENT",
    "ACC_BRANCH_ID": "BRANCH",
    "RELATED_BRANCH_ID": "BRANCH",
    "RELATED_COMPANY_BRANCH_ID": "BRANCH",
    # Project aliases
    "ACC_PROJECT_ID": "PRO_PROJECTS",
    "ROW_PROJECT_ID": "PRO_PROJECTS",
    # Partner aliases
    "OUTSRC_PARTNER_ID": "COMPANY_PARTNER",
    "OUTSRC_CMP_ID": "COMPANY",
    "SUP_PARTNER_ID": "COMPANY_PARTNER",
    "MANAGER_PARTNER_ID": "COMPANY_PARTNER",
    "AUTHOR_PARTNER_ID": "COMPANY_PARTNER",
    # Consumer aliases
    "OUTSRC_CONSUMER_ID": "CONSUMER",
    "SUP_CONSUMER_ID": "CONSUMER",
    "RELATED_CONSUMER_ID": "CONSUMER",
    "ACC_CONSUMER_ID": "CONSUMER",
    # Other
    "EMPAPP_ID": "EMPLOYEES_APP_EDU_INFO",
    "CARD_CAT_ID": "SETUP_PROCESS_CAT",
    "CARD_DOCUMENT_TYPE": "SETUP_DOCUMENT_TYPE",
}


def discover_by_alias(tables: list[TableInfo]) -> list[dict]:
    """Find relationships using known column name aliases."""
    table_names = {t.name for t in tables}
    relationships = []

    for table in tables:
        for col in table.columns:
            if col.name in ALIAS_MAP:
                target = ALIAS_MAP[col.name]
                if target in table_names and target != table.name:
                    relationships.append({
                        "from_table": table.name,
                        "from_column": col.name,
                        "to_table": target,
                        "to_column": _guess_pk_column(target),
                        "confidence": 0.90,
                        "source": "alias_pattern",
                    })

    logger.info("Alias patterns: discovered %d relationships", len(relationships))
    return relationships


def _guess_pk_column(table_name: str) -> str:
    """Guess PK column name from table name."""
    # COMPANY -> COMPANY_ID, EMPLOYEES -> EMPLOYEE_ID
    if table_name.endswith("S"):
        return table_name[:-1] + "_ID"
    return table_name + "_ID"
