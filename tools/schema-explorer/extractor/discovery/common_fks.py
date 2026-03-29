"""Technique 4: Common FK column patterns pointing to known master tables."""
import logging
from ..connectors.base import TableInfo

logger = logging.getLogger(__name__)

# Well-known FK column → target table mappings
COMMON_FK_MAP = {
    "COMPANY_ID": "COMPANY",
    "EMPLOYEE_ID": "EMPLOYEES",
    "OUR_COMPANY_ID": "OUR_COMPANY",
    "BRANCH_ID": "BRANCH",
    "PROJECT_ID": "PRO_PROJECTS",
    "CONSUMER_ID": "CONSUMER",
    "DEPARTMENT_ID": "DEPARTMENT",
    "PARTNER_ID": "COMPANY_PARTNER",
    "PERIOD_ID": "SETUP_DUTY_PERIOD",
    "EXPENSE_ITEM_ID": "EXPENSE_ITEMS",
    "EXPENSE_CENTER_ID": "EXPENSE_CENTER",
    "PAYMETHOD_ID": "SETUP_PAYMETHOD",
    "COMMETHOD_ID": "SETUP_COMMETHOD",
    "ACTIVITY_TYPE_ID": "SETUP_ACTIVITY_TYPES",
    "ORGANIZATION_STEP_ID": "SETUP_ORGANIZATION_STEPS",
    "OFFTIMECAT_ID": "SETUP_OFFTIME",
    "TRAINING_ID": "TRAINING",
    "TRAINING_CAT_ID": "TRAINING_CAT",
    "SURVEY_MAIN_ID": "SURVEY_MAIN",
    "PROCESS_CAT_ID": "SETUP_PROCESS_CAT",
    "STOCK_ID": "SETUP_STOCK_AMOUNT",
    "PRODUCT_ID": "PRODUCTS",
    "UNIT_ID": "SETUP_UNIT",
    "BRAND_ID": "SETUP_BRAND",
    "MONEY_ID": "SETUP_MONEY",
}


def discover_by_common_fks(tables: list[TableInfo]) -> list[dict]:
    """Find relationships using well-known FK column patterns."""
    table_names = {t.name for t in tables}
    relationships = []

    for table in tables:
        for col in table.columns:
            if col.name in COMMON_FK_MAP:
                target = COMMON_FK_MAP[col.name]
                if target in table_names and target != table.name:
                    relationships.append({
                        "from_table": table.name,
                        "from_column": col.name,
                        "to_table": target,
                        "to_column": col.name,
                        "confidence": 0.92,
                        "source": "common_fk",
                    })

    logger.info("Common FKs: discovered %d relationships", len(relationships))
    return relationships
