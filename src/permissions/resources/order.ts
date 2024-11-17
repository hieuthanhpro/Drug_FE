// Tính năng trang Đặt hàng
const ORDER_ADD = "order_add";
const ORDER_EDIT = "order_edit";
const ORDER_CANCEL = "order_cancel";
const ORDER_STATUS = "order_status";
const ORDER_COPY = "order_copy";
const ORDER_EXPORT = "order_export";
const ORDER_PRINT = "order_print";

const ORDER_LIST = "order_list";

export const PERMISSION_ORDER_GENERAL = {
  ORDER_ADD: ORDER_ADD,
  ORDER_EDIT: ORDER_EDIT,
  ORDER_CANCEL: ORDER_CANCEL,
  ORDER_STATUS: ORDER_STATUS,
  ORDER_EXPORT: ORDER_EXPORT,
  ORDER_COPY: ORDER_COPY,
  ORDER_LIST: ORDER_LIST,
  ORDER_PRINT: ORDER_PRINT,
};

const ORDER_TEMP_LIST = "order_temp_list";
const ORDER_TEMP_EXPORT = "order_temp_export";
const ORDER_TEMP_CANCEL = "order_temp_cancel";
const ORDER_TEMP_EDIT = "order_temp_edit";

export const PERMISSION_ORDER_TEMP = {
  ORDER_TEMP_LIST: ORDER_TEMP_LIST,
  ORDER_TEMP_EXPORT: ORDER_TEMP_EXPORT,
  ORDER_TEMP_CANCEL: ORDER_TEMP_CANCEL,
  ORDER_TEMP_EDIT: ORDER_TEMP_EDIT,
};

export const PERMISSION_ORDER = { ...PERMISSION_ORDER_GENERAL, ...PERMISSION_ORDER_TEMP };
