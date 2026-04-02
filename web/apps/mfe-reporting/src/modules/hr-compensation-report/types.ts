export type HrCompensationFilters = {
  search: string;
  department: string;
  company: string;
  collarType: string;
  gender: string;
  education: string;
};

export type HrCompensationRow = {
  EMPLOYEE_ID: number;
  FULL_NAME: string;
  DEPARTMENT_NAME: string;
  POSITION_NAME: string;
  BRANCH_NAME: string;
  COMPANY_NAME: string;
  COLLAR_TYPE: number;
  GENDER: number;
  EDUCATION: string;
  TENURE_YEARS: number | null;
  AGE: number | null;
  GROSS_SALARY: number | null;
  NET_SALARY: number | null;
  TOTAL_EMPLOYER_COST: number | null;
  SSK_EMPLOYER: number | null;
  INCOME_TAX: number | null;
  OVERTIME_PAY: number | null;
  SEVERANCE_AMOUNT: number | null;
  IS_CRITICAL: number;
};
