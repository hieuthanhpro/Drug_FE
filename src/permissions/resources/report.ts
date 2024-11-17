// Tính năng trang Báo cáo
const REPORT_MANAGEMENT_REAL_REVENUE_LIST = "report_management_real_revenue_list";
const REPORT_MANAGEMENT_REAL_REVENUE_EXPORT = "report_management_real_revenue_export";

export const PERMISSION_REPORT_MANAGEMENT_REAL_REVENUE = {
  REPORT_MANAGEMENT_REAL_REVENUE_LIST: REPORT_MANAGEMENT_REAL_REVENUE_LIST,
  REPORT_MANAGEMENT_REAL_REVENUE_EXPORT: REPORT_MANAGEMENT_REAL_REVENUE_EXPORT,
};

const REPORT_MANAGEMENT_REVENUE_GUM_PROFIT_LIST = "report_management_revenue_gum_profit_list";
const REPORT_MANAGEMENT_REVENUE_GUM_PROFIT_EXPORT = "report_management_revenue_gum_profit_export";

export const PERMISSION_REPORT_MANAGEMENT_REVENUE_GUM_PROFIT = {
  REPORT_MANAGEMENT_REVENUE_GUM_PROFIT_LIST: REPORT_MANAGEMENT_REVENUE_GUM_PROFIT_LIST,
  REPORT_MANAGEMENT_REVENUE_GUM_PROFIT_EXPORT: REPORT_MANAGEMENT_REVENUE_GUM_PROFIT_EXPORT,
};

const REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE_LIST = "report_management_revenue_sale_employee_list";
const REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE_EXPORT = "report_management_revenue_sale_employee_export";

export const PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE = {
  REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE_LIST: REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE_LIST,
  REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE_EXPORT: REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE_EXPORT,
};

const REPORT_MANAGEMENT_IMPORT_SELL_LIST = "report_management_import_sell_list";
const REPORT_MANAGEMENT_IMPORT_SELL_EXPORT = "report_management_import_sell_export";

export const PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL = {
  REPORT_MANAGEMENT_IMPORT_SELL_LIST: REPORT_MANAGEMENT_IMPORT_SELL_LIST,
  REPORT_MANAGEMENT_IMPORT_SELL_EXPORT: REPORT_MANAGEMENT_IMPORT_SELL_EXPORT,
};

const REPORT_MEDICAL_SALES_PRESCRIPTION_LIST = "report_medical_sales_prescription_list";
const REPORT_MEDICAL_SALES_PRESCRIPTION_EXPORT = "report_medical_sales_prescription_export";

export const PERMISSION_REPORT_MEDICAL_SALES_PRESCRIPTION = {
  REPORT_MEDICAL_SALES_PRESCRIPTION_LIST: REPORT_MEDICAL_SALES_PRESCRIPTION_LIST,
  REPORT_MEDICAL_SALES_PRESCRIPTION_EXPORT: REPORT_MEDICAL_SALES_PRESCRIPTION_EXPORT,
};

const REPORT_MEDICAL_QUALITY_CONTROL_LIST = "report_medical_quality_control_list";
const REPORT_MEDICAL_QUALITY_CONTROL_EXPORT = "report_medical_quality_control_export";
const REPORT_MEDICAL_QUALITY_CONTROL_ADD = "report_medical_quality_control_add";
const REPORT_MEDICAL_QUALITY_CONTROL_PRINT = "report_medical_quality_control_print";
const REPORT_MEDICAL_QUALITY_CONTROL_DELETE = "report_medical_quality_control_delete";

export const PERMISSION_REPORT_MEDICAL_QUALITY_CONTROL = {
  REPORT_MEDICAL_QUALITY_CONTROL_LIST: REPORT_MEDICAL_QUALITY_CONTROL_LIST,
  REPORT_MEDICAL_QUALITY_CONTROL_EXPORT: REPORT_MEDICAL_QUALITY_CONTROL_EXPORT,
  REPORT_MEDICAL_QUALITY_CONTROL_ADD: REPORT_MEDICAL_QUALITY_CONTROL_ADD,
  REPORT_MEDICAL_QUALITY_CONTROL_PRINT: REPORT_MEDICAL_QUALITY_CONTROL_PRINT,
  REPORT_MEDICAL_QUALITY_CONTROL_DELETE: REPORT_MEDICAL_QUALITY_CONTROL_DELETE,
};

const REPORT_MEDICAL_SPECIAL_DRUG_LIST = "report_medical_special_drug_list";
const REPORT_MEDICAL_SPECIAL_DRUG_EXPORT = "report_medical_special_drug_export";

export const PERMISSION_REPORT_MEDICAL_SPECIAL_DRUG = {
  REPORT_MEDICAL_SPECIAL_DRUG_LIST: REPORT_MEDICAL_SPECIAL_DRUG_LIST,
  REPORT_MEDICAL_SPECIAL_DRUG_EXPORT: REPORT_MEDICAL_SPECIAL_DRUG_EXPORT,
};

export const PERMISSION_REPORT_MEDICAL = {
  ...PERMISSION_REPORT_MEDICAL_SALES_PRESCRIPTION,
  ...PERMISSION_REPORT_MEDICAL_QUALITY_CONTROL,
  ...PERMISSION_REPORT_MEDICAL_SPECIAL_DRUG,
};

export const PERMISSION_REPORT_MANAGER = {
  ...PERMISSION_REPORT_MANAGEMENT_REAL_REVENUE,
  ...PERMISSION_REPORT_MANAGEMENT_REVENUE_GUM_PROFIT,
  ...PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE,
  ...PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
};

export const PERMISSION_REPORT = {
  ...PERMISSION_REPORT_MEDICAL,
  ...PERMISSION_REPORT_MANAGER,
};