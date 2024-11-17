// Tính năng trang Thuốc
const DRUG_ADD = "drug_add";
const DRUG_EDIT = "drug_edit";
const DRUG_STOP_BUSINESS = "drug_stop_business";
const DRUG_EXPORT = "drug_export";
const DRUG_IMPORT = "drug_import";
const DRUG_PRINT = "drug_print";
const DRUG_LIST = "drug_list";

export const PERMISSION_DRUG_GENERAL = {
  DRUG_ADD: DRUG_ADD,
  DRUG_EDIT: DRUG_EDIT,
  DRUG_STOP_BUSINESS: DRUG_STOP_BUSINESS,
  DRUG_EXPORT: DRUG_EXPORT,
  DRUG_IMPORT: DRUG_IMPORT,
  DRUG_PRINT: DRUG_PRINT,
  DRUG_LIST: DRUG_LIST,
};

const DRUG_GROUP_EDIT = "drug_group_edit";
const DRUG_GROUP_DELETE = "drug_group_delete";
const DRUG_GROUP_ADD = "drug_group_add";
const DRUG_GROUP_LIST = "drug_group_list";
const DRUG_GROUP_EXPORT = "drug_group_export";

export const PERMISSION_DRUG_GROUP = {
  DRUG_GROUP_EDIT: DRUG_GROUP_EDIT,
  DRUG_GROUP_DELETE: DRUG_GROUP_DELETE,
  DRUG_GROUP_ADD: DRUG_GROUP_ADD,
  DRUG_GROUP_LIST: DRUG_GROUP_LIST,
  DRUG_GROUP_EXPORT: DRUG_GROUP_EXPORT,
};

const DRUG_CATEGORY_EDIT = "drug_category_edit";
const DRUG_CATEGORY_DELETE = "drug_category_delete";
const DRUG_CATEGORY_ADD = "drug_category_add";
const DRUG_CATEGORY_LIST = "drug_category_list";
const DRUG_CATEGORY_EXPORT = "drug_category_export";

export const PERMISSION_DRUG_CATEGORY = {
  DRUG_CATEGORY_EDIT: DRUG_CATEGORY_EDIT,
  DRUG_CATEGORY_DELETE: DRUG_CATEGORY_DELETE,
  DRUG_CATEGORY_ADD: DRUG_CATEGORY_ADD,
  DRUG_CATEGORY_LIST: DRUG_CATEGORY_LIST,
  DRUG_CATEGORY_EXPORT: DRUG_CATEGORY_EXPORT,
};

export const PERMISSION_DRUG = {
  ...PERMISSION_DRUG_GENERAL,
  ...PERMISSION_DRUG_GROUP,
  ...PERMISSION_DRUG_CATEGORY,
};
