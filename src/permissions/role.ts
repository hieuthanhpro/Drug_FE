import { PERMISSION_DASHBOARD } from "./resources/dashboard";
import { PERMISSION_DRUG } from "./resources/drug";
import { PERMISSION_PRODUCT } from "./resources/product";
import { PERMISSION_ORDER } from "./resources/order";
import { PERMISSION_ORDER_MANAGE } from "./resources/orderManage";
import {
  PERMISSION_SALES,
  PERMISSION_SALES_INVOICES,
  PERMISSION_SALES_PAYMENT_HISTORY,
  PERMISSION_SALES_RETURN,
  PERMISSION_SALES_STATISTIC,
} from "./resources/sales";
import {
  PERMISSION_WAREHOUSING,
  PERMISSION_WAREHOUSING_PAYMENT_HISTORY,
  PERMISSION_WAREHOUSING_RETURN,
  PERMISSION_WAREHOUSING_STATISTIC,
  PERMISSION_WAREHOUSING_INVOICES,
} from "./resources/warehousing";
import {
  PERMISSION_REPORT,
  PERMISSION_REPORT_MANAGEMENT_REAL_REVENUE,
  PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
  PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE,
  PERMISSION_REPORT_MANAGEMENT_REVENUE_GUM_PROFIT,
  PERMISSION_REPORT_MEDICAL,
} from "./resources/report";
import {
  PERMISSION_WAREHOUSE,
  PERMISSION_WAREHOUSE_IMPORT,
  PERMISSION_WAREHOUSE_EXPORT,
  PERMISSION_WAREHOUSE_STOCK,
  PERMISSION_WAREHOUSE_CHECK,
  PERMISSION_WAREHOUSE_CANCEL,
  PERMISSION_WAREHOUSE_REPORT,
} from "./resources/warehouse";
import { PERMISSION_CASHBOOK } from "./resources/cashbook";
import {
  PERMISSION_MANAGE,
  PERMISSION_MANAGE_GENERAL,
  PERMISSION_MANAGE_SUPPLIER,
  PERMISSION_MANAGE_PROMOTION,
  PERMISSION_MANAGE_CUSTOMER,
  PERMISSION_MANAGE_EMPLOYEE,
} from "./resources/manager";

import { PERMISSION_ADMIN } from "./resources/admin";

const getValueFromObject = (object) => {
  const values = [];
  for (const [key, value] of Object.entries(object)) {
    values.push(value);
  }
  return values;
};

const getValueFromArray = (array) => {
  let values = [];
  array.map((item) => {
    if (typeof item === "object" && !Array.isArray(item) && item !== null) {
      values = [...values, ...getValueFromObject(item)];
    } else {
      values.push(item);
    }
    return null;
  });
  return values;
};

export const roleGDP = {
  admin: {
    name: "Admin",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_SALES,
      PERMISSION_WAREHOUSING,
      PERMISSION_ORDER,
      PERMISSION_ORDER_MANAGE,
      PERMISSION_REPORT,
      PERMISSION_WAREHOUSE,
      PERMISSION_MANAGE,
      PERMISSION_CASHBOOK,
    ]),
  },
  stock_manage: {
    name: "Quản lý kho",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_SALES_PAYMENT_HISTORY,
      PERMISSION_WAREHOUSING,
      PERMISSION_ORDER,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MEDICAL,
      PERMISSION_WAREHOUSE,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_SUPPLIER,
      PERMISSION_MANAGE_PROMOTION,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_STATISTIC_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_STATISTIC_EXPORT,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_SELL,
      PERMISSION_DRUG.DRUG_GROUP_DELETE,
      PERMISSION_DRUG.DRUG_CATEGORY_DELETE,
      PERMISSION_PRODUCT.PRODUCT_GROUP_DELETE,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_DELETE,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_CANCEL,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_STATUS,
      PERMISSION_WAREHOUSING.WAREHOUSING_ADD,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_COPY,
    ]),
  },
  stock_employee: {
    name: "Nhân viên kho",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_WAREHOUSING,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_WAREHOUSE,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_SUPPLIER,
      PERMISSION_ORDER.ORDER_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_EXPORT,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_PRINT,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_STATISTIC_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_STATISTIC_EXPORT,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_SELL,
      PERMISSION_DASHBOARD.DASHBOARD_ORDER,
      PERMISSION_DRUG.DRUG_GROUP_DELETE,
      PERMISSION_DRUG.DRUG_CATEGORY_DELETE,
      PERMISSION_PRODUCT.PRODUCT_GROUP_DELETE,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_DELETE,
      PERMISSION_WAREHOUSING.WAREHOUSING_ADD,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_CANCEL,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_STATUS,
      PERMISSION_WAREHOUSE.WAREHOUSE_IMPORT_CANCEL,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_CONFIRM,
      PERMISSION_WAREHOUSE.WAREHOUSE_CANCEL_CONFIRM,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_WAREHOUSING_PAYMENT_HISTORY,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_COPY,
    ]),
  },
  sell_manage: {
    name: "Quản lý bán hàng",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_SALES,
      PERMISSION_WAREHOUSING_RETURN,
      PERMISSION_WAREHOUSING_STATISTIC,
      PERMISSION_WAREHOUSING_PAYMENT_HISTORY,
      PERMISSION_REPORT_MANAGEMENT_REAL_REVENUE,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE,
      PERMISSION_REPORT_MEDICAL,
      PERMISSION_WAREHOUSE_EXPORT,
      PERMISSION_WAREHOUSE_STOCK,
      PERMISSION_WAREHOUSE_REPORT,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_SUPPLIER,
      PERMISSION_MANAGE_PROMOTION,
      PERMISSION_MANAGE_CUSTOMER,
      PERMISSION_CASHBOOK,
      PERMISSION_ORDER_MANAGE,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_PRINT,
      PERMISSION_ORDER.ORDER_LIST,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_WAREHOUSING,
      PERMISSION_DASHBOARD.DASHBOARD_ORDER,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_PRINT,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_CANCEL,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_COPY,
      PERMISSION_ORDER.ORDER_CANCEL,
    ]),
  },
  sell: {
    name: "Nhân viên bán hàng",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_SALES,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE,
      PERMISSION_REPORT_MEDICAL,
      PERMISSION_WAREHOUSE_STOCK,
      PERMISSION_WAREHOUSE_REPORT,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_SUPPLIER,
      PERMISSION_MANAGE_PROMOTION,
      PERMISSION_MANAGE_CUSTOMER,
      PERMISSION_CASHBOOK,
      PERMISSION_ORDER_MANAGE,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_EXPORT,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_PRINT,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_WAREHOUSING,
      PERMISSION_DASHBOARD.DASHBOARD_ORDER,
      PERMISSION_DRUG.DRUG_GROUP_DELETE,
      PERMISSION_DRUG.DRUG_CATEGORY_DELETE,
      PERMISSION_PRODUCT.PRODUCT_GROUP_DELETE,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_DELETE,
      PERMISSION_SALES.SALES_INVOICES_STATUS,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_SALES_PAYMENT_HISTORY,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_COPY,
      PERMISSION_ORDER.ORDER_ADD,
      PERMISSION_SALES.SALES_STATISTIC_EXPORT,
    ]),
  },
  warehousing_manage: {
    name: "Quản lý nhập hàng",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_WAREHOUSING,
      PERMISSION_ORDER,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MEDICAL,
      PERMISSION_WAREHOUSE,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_SUPPLIER,
      PERMISSION_MANAGE_PROMOTION,
      PERMISSION_MANAGE_CUSTOMER,
      PERMISSION_CASHBOOK,
      PERMISSION_ORDER_MANAGE,
      PERMISSION_SALES.SALES_INVOICES_LIST,
      PERMISSION_SALES.SALES_INVOICES_PRINT,
      PERMISSION_SALES.SALES_RETURN_LIST,
      PERMISSION_SALES_PAYMENT_HISTORY,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_SELL,
      PERMISSION_WAREHOUSING.WAREHOUSING_ADD,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_IMPORT,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_CANCEL,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_CONFIRM,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_PRINT,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_TEMP,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_COPY,
    ]),
  },
  warehousing: {
    name: "Nhân viên nhập hàng",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_WAREHOUSING,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MEDICAL,
      PERMISSION_WAREHOUSE_IMPORT,
      PERMISSION_WAREHOUSE_STOCK,
      PERMISSION_WAREHOUSE_CHECK,
      PERMISSION_WAREHOUSE_CANCEL,
      PERMISSION_WAREHOUSE_REPORT,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_SUPPLIER,
      PERMISSION_SALES.SALES_INVOICES_LIST,
      PERMISSION_SALES.SALES_INVOICES_PRINT,
      PERMISSION_SALES.SALES_RETURN_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_LIST,
      PERMISSION_ORDER.ORDER_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_CREATE,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_EXPORT,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_PRINT,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_STATISTIC_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_STATISTIC_EXPORT,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_SELL,
      PERMISSION_DASHBOARD.DASHBOARD_ORDER,
      PERMISSION_WAREHOUSING.WAREHOUSING_ADD,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_STATUS,
      PERMISSION_WAREHOUSE.WAREHOUSE_IMPORT_CANCEL,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_CONFIRM,
      PERMISSION_WAREHOUSE.WAREHOUSE_CANCEL_CONFIRM,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_EXPORT,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_WAREHOUSING_PAYMENT_HISTORY,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_COPY,
      PERMISSION_ORDER.ORDER_ADD,
    ]),
  },
  cashier: {
    name: "Thu ngân",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG.DRUG_LIST,
      PERMISSION_DRUG.DRUG_EXPORT,
      PERMISSION_DRUG.DRUG_PRINT,
      PERMISSION_DRUG.DRUG_GROUP_LIST,
      PERMISSION_DRUG.DRUG_GROUP_EXPORT,
      PERMISSION_DRUG.DRUG_CATEGORY_LIST,
      PERMISSION_DRUG.DRUG_CATEGORY_EXPORT,
      PERMISSION_PRODUCT.PRODUCT_PRINT,
      PERMISSION_PRODUCT.PRODUCT_EXPORT,
      PERMISSION_PRODUCT.PRODUCT_LIST,
      PERMISSION_PRODUCT.PRODUCT_GROUP_LIST,
      PERMISSION_PRODUCT.PRODUCT_GROUP_EXPORT,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_ADD,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_LIST,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_EXPORT,
      PERMISSION_SALES_INVOICES.SALES_INVOICES_LIST,
      PERMISSION_SALES_INVOICES.SALES_INVOICES_EXPORT,
      PERMISSION_SALES_INVOICES.SALES_INVOICES_PRINT,
      PERMISSION_SALES_RETURN,
      PERMISSION_SALES_STATISTIC,
      PERMISSION_SALES_PAYMENT_HISTORY,
      PERMISSION_WAREHOUSING_INVOICES.WAREHOUSING_INVOICES_LIST,
      PERMISSION_WAREHOUSING_INVOICES.WAREHOUSING_INVOICES_EXPORT,
      PERMISSION_WAREHOUSING_INVOICES.WAREHOUSING_INVOICES_PRINT,
      PERMISSION_WAREHOUSING_RETURN,
      PERMISSION_WAREHOUSING_STATISTIC,
      PERMISSION_WAREHOUSING.WAREHOUSING_TEMP_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_TEMP_EXPORT,
      PERMISSION_WAREHOUSING_PAYMENT_HISTORY,
      PERMISSION_REPORT_MANAGEMENT_REAL_REVENUE,
      PERMISSION_REPORT_MANAGEMENT_REVENUE_GUM_PROFIT,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_WAREHOUSE_STOCK,
      PERMISSION_WAREHOUSE_REPORT,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_SUPPLIER,
      PERMISSION_MANAGE_CUSTOMER,
      PERMISSION_CASHBOOK,
      PERMISSION_ORDER.ORDER_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_IMPORT_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_CANCEL_LIST,
      PERMISSION_MANAGE_PROMOTION.MANAGE_PROMOTION_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_PRINT,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_EXPORT,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_STATISTIC_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_STATISTIC_EXPORT,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_ORDER,
      PERMISSION_SALES_RETURN.SALES_RETURN_IMPORT,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_COPY,
    ]),
  },
  sale: {
    name: "Sale bán hàng",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG.DRUG_LIST,
      PERMISSION_DRUG.DRUG_EXPORT,
      PERMISSION_DRUG.DRUG_PRINT,
      PERMISSION_DRUG.DRUG_LIST,
      PERMISSION_DRUG.DRUG_GROUP_LIST,
      PERMISSION_DRUG.DRUG_GROUP_EXPORT,
      PERMISSION_DRUG.DRUG_CATEGORY_LIST,
      PERMISSION_DRUG.DRUG_CATEGORY_EXPORT,
      PERMISSION_PRODUCT.PRODUCT_LIST,
      PERMISSION_PRODUCT.PRODUCT_EXPORT,
      PERMISSION_PRODUCT.PRODUCT_PRINT,
      PERMISSION_PRODUCT.PRODUCT_GROUP_LIST,
      PERMISSION_PRODUCT.PRODUCT_GROUP_EXPORT,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_LIST,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_EXPORT,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_ADD,
      PERMISSION_SALES_INVOICES.SALES_INVOICES_LIST,
      PERMISSION_SALES_INVOICES.SALES_INVOICES_EXPORT,
      PERMISSION_SALES_INVOICES.SALES_INVOICES_PRINT,
      PERMISSION_SALES_RETURN,
      PERMISSION_SALES_STATISTIC.SALES_STATISTIC_LIST,
      PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE,
      PERMISSION_WAREHOUSE_STOCK,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_CUSTOMER,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_CREATE,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_STATISTIC_LIST,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_STATISTIC_EXPORT,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_EXPORT,
      PERMISSION_ORDER_MANAGE.ORDER_MANAGE_PRINT,
      PERMISSION_ORDER.ORDER_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_IMPORT_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_EXPORT_LIST,
      PERMISSION_CASHBOOK.CASHBOOK_RECEIPT_LIST,
      PERMISSION_MANAGE_PROMOTION.MANAGE_PROMOTION_ADD,
      PERMISSION_MANAGE_PROMOTION.MANAGE_PROMOTION_LIST,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_SELL,
      PERMISSION_DASHBOARD.DASHBOARD_WAREHOUSING,
      PERMISSION_DASHBOARD.DASHBOARD_ORDER,
      PERMISSION_DASHBOARD.DASHBOARD_SUPPLIER_ORDER,
      PERMISSION_DASHBOARD.DASHBOARD_SUPPLIER_PRICE,
      PERMISSION_SALES_RETURN.SALES_RETURN_IMPORT,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_COPY,
      PERMISSION_ORDER.ORDER_ADD,
      PERMISSION_CASHBOOK.CASHBOOK_RECEIPT_PRINT,
    ]),
  },
  system: {
    name: "Quản trị hệ thống",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_SALES,
      PERMISSION_WAREHOUSING,
      PERMISSION_ORDER,
      PERMISSION_ORDER_MANAGE,
      PERMISSION_REPORT,
      PERMISSION_WAREHOUSE,
      PERMISSION_CASHBOOK,
      PERMISSION_MANAGE,
      PERMISSION_ADMIN,
    ]),
  },
};

export const roleGPP = {
  admin: {
    name: "Admin",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_SALES,
      PERMISSION_WAREHOUSING,
      PERMISSION_ORDER,
      PERMISSION_ORDER_MANAGE,
      PERMISSION_REPORT,
      PERMISSION_WAREHOUSE,
      PERMISSION_CASHBOOK,
      PERMISSION_MANAGE,
    ]),
  },
  sell_manage: {
    name: "Quản lý bán hàng",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_SALES,
      PERMISSION_ORDER,
      PERMISSION_REPORT_MANAGEMENT_REAL_REVENUE,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE,
      PERMISSION_REPORT_MEDICAL,
      PERMISSION_WAREHOUSE_STOCK,
      PERMISSION_WAREHOUSE_REPORT,
      PERMISSION_CASHBOOK,
      PERMISSION_MANAGE,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_PRINT,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_EXPORT,
      PERMISSION_WAREHOUSING.WAREHOUSING_RETURN_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_RETURN_EXPORT,
      PERMISSION_WAREHOUSING.WAREHOUSING_RETURN_PRINT,
      PERMISSION_WAREHOUSING.WAREHOUSING_PAYMENT_HISTORY_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_PAYMENT_HISTORY_EXPORT,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_PRINT,
      PERMISSION_WAREHOUSE.WAREHOUSE_CANCEL_LIST,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_WAREHOUSING,
      PERMISSION_DRUG.DRUG_GROUP_DELETE,
      PERMISSION_DRUG.DRUG_CATEGORY_DELETE,
      PERMISSION_PRODUCT.PRODUCT_GROUP_DELETE,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_DELETE,
      PERMISSION_MANAGE_EMPLOYEE.MANAGE_EMPLOYEE_DELETE,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
    ]),
  },
  sell: {
    name: "Dược sỹ bán hàng",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_SALES,
      PERMISSION_ORDER,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE,
      PERMISSION_REPORT_MEDICAL,
      PERMISSION_WAREHOUSE_STOCK,
      PERMISSION_WAREHOUSE_REPORT,
      PERMISSION_CASHBOOK,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_PROMOTION,
      PERMISSION_MANAGE_CUSTOMER,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_PRINT,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_EXPORT,
      PERMISSION_WAREHOUSING.WAREHOUSING_RETURN_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_RETURN_EXPORT,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_PRINT,
      PERMISSION_WAREHOUSE.WAREHOUSE_CANCEL_LIST,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_WAREHOUSING,
      PERMISSION_DRUG.DRUG_GROUP_DELETE,
      PERMISSION_DRUG.DRUG_CATEGORY_DELETE,
      PERMISSION_PRODUCT.PRODUCT_GROUP_DELETE,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_DELETE,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_WAREHOUSING.WAREHOUSING_RETURN_PRINT,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_EXPORT,
      PERMISSION_WAREHOUSE.WAREHOUSE_CANCEL_PRINT,
    ]),
  },
  warehousing_manage: {
    name: "Quản lý nhập hàng",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_WAREHOUSING,
      PERMISSION_ORDER,
      PERMISSION_REPORT_MANAGEMENT_REAL_REVENUE,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE,
      PERMISSION_REPORT_MEDICAL,
      PERMISSION_WAREHOUSE,
      PERMISSION_CASHBOOK,
      PERMISSION_MANAGE,
      PERMISSION_SALES.SALES_INVOICES_LIST,
      PERMISSION_SALES.SALES_INVOICES_PRINT,
      PERMISSION_SALES.SALES_INVOICES_EXPORT,
      PERMISSION_SALES.SALES_RETURN_LIST,
      PERMISSION_SALES.SALES_RETURN_PRINT,
      PERMISSION_SALES.SALES_PAYMENT_HISTORY_LIST,
      PERMISSION_SALES.SALES_PAYMENT_HISTORY_EXPORT,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_SELL,
      PERMISSION_MANAGE_EMPLOYEE.MANAGE_EMPLOYEE_DELETE,
      PERMISSION_WAREHOUSE_IMPORT,
      PERMISSION_WAREHOUSE_EXPORT,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_SALES.SALES_RETURN_EXPORT,
    ]),
  },
  warehousing: {
    name: "Dược sỹ nhập hàng",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_WAREHOUSING,
      PERMISSION_ORDER,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MEDICAL,
      PERMISSION_WAREHOUSE,
      PERMISSION_CASHBOOK,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_SUPPLIER,
      PERMISSION_SALES.SALES_INVOICES_LIST,
      PERMISSION_SALES.SALES_INVOICES_PRINT,
      PERMISSION_SALES.SALES_INVOICES_EXPORT,
      PERMISSION_SALES.SALES_RETURN_LIST,
      PERMISSION_SALES.SALES_RETURN_PRINT,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_SELL,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_STATUS,
      PERMISSION_WAREHOUSING.WAREHOUSING_PAYMENT_HISTORY_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_PAYMENT_HISTORY_EXPORT,
      PERMISSION_ORDER.ORDER_CANCEL,
      PERMISSION_ORDER.ORDER_STATUS,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_CONFIRM,
      PERMISSION_WAREHOUSE.WAREHOUSE_CANCEL_CONFIRM,
      PERMISSION_WAREHOUSE_IMPORT,
      PERMISSION_WAREHOUSE_EXPORT,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
      PERMISSION_SALES.SALES_RETURN_EXPORT,
    ]),
  },
  cashier: {
    name: "Thu ngân",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_SALES,
      PERMISSION_WAREHOUSING_RETURN,
      PERMISSION_WAREHOUSING_STATISTIC,
      PERMISSION_ORDER,
      PERMISSION_ORDER.ORDER_TEMP_EXPORT,
      PERMISSION_REPORT_MANAGEMENT_REAL_REVENUE,
      PERMISSION_REPORT_MANAGEMENT_REVENUE_GUM_PROFIT,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE,
      PERMISSION_WAREHOUSE,
      PERMISSION_CASHBOOK,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_SUPPLIER,
      PERMISSION_MANAGE_CUSTOMER,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_PRINT,
      PERMISSION_WAREHOUSING.WAREHOUSING_TEMP_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_EXPORT,
      PERMISSION_WAREHOUSING.WAREHOUSING_PAYMENT_HISTORY_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_PAYMENT_HISTORY_EXPORT,
      PERMISSION_MANAGE_PROMOTION.MANAGE_PROMOTION_LIST,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_SELL,
      PERMISSION_DASHBOARD.DASHBOARD_ORDER,
      PERMISSION_DASHBOARD.DASHBOARD_WAREHOUSING,
      PERMISSION_DRUG.DRUG_EDIT,
      PERMISSION_DRUG.DRUG_STOP_BUSINESS,
      PERMISSION_DRUG.DRUG_GROUP_EDIT,
      PERMISSION_DRUG.DRUG_GROUP_DELETE,
      PERMISSION_DRUG.DRUG_GROUP_ADD,
      PERMISSION_DRUG.DRUG_CATEGORY_EDIT,
      PERMISSION_DRUG.DRUG_CATEGORY_ADD,
      PERMISSION_DRUG.DRUG_CATEGORY_DELETE,
      PERMISSION_PRODUCT.PRODUCT_EDIT,
      PERMISSION_PRODUCT.PRODUCT_STOP_BUSINESS,
      PERMISSION_PRODUCT.PRODUCT_GROUP_EDIT,
      PERMISSION_PRODUCT.PRODUCT_GROUP_DELETE,
      PERMISSION_PRODUCT.PRODUCT_GROUP_ADD,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_EDIT,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_ADD,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_DELETE,
      PERMISSION_SALES.SALES_INVOICES_RETURN,
      PERMISSION_SALES.SALES_INVOICES_CANCEL,
      PERMISSION_SALES.SALES_INVOICES_STATUS,
      PERMISSION_ORDER.ORDER_STATUS,
      PERMISSION_ORDER.ORDER_CANCEL,
      PERMISSION_ORDER.ORDER_ADD,
      PERMISSION_ORDER.ORDER_EDIT,
      PERMISSION_ORDER.ORDER_TEMP_CANCEL,
      PERMISSION_ORDER.ORDER_TEMP_EDIT,
      PERMISSION_ORDER.ORDER_EXPORT,
      PERMISSION_ORDER.ORDER_COPY,
      PERMISSION_ORDER.ORDER_PRINT,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_ADD,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_EDIT,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_CONFIRM,
      PERMISSION_WAREHOUSE.WAREHOUSE_CANCEL_CONFIRM,
      PERMISSION_WAREHOUSE.WAREHOUSE_CANCEL_ADD,
      PERMISSION_WAREHOUSE_IMPORT,
      PERMISSION_WAREHOUSE_EXPORT,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
    ]),
  },
  sale: {
    name: "Sale bán hàng",
    resources: getValueFromArray([
      PERMISSION_DASHBOARD,
      PERMISSION_DRUG,
      PERMISSION_PRODUCT,
      PERMISSION_SALES,
      PERMISSION_ORDER,
      PERMISSION_REPORT_MANAGEMENT_IMPORT_SELL,
      PERMISSION_REPORT_MANAGEMENT_REVENUE_SALE_EMPLOYEE,
      PERMISSION_REPORT_MEDICAL,
      PERMISSION_WAREHOUSE_STOCK,
      PERMISSION_WAREHOUSE_REPORT,
      PERMISSION_CASHBOOK,
      PERMISSION_MANAGE_GENERAL,
      PERMISSION_MANAGE_CUSTOMER,
      PERMISSION_MANAGE_PROMOTION,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_LIST,
      PERMISSION_WAREHOUSING.WAREHOUSING_INVOICES_PRINT,
      PERMISSION_WAREHOUSING.WAREHOUSING_RETURN_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_CHECK_PRINT,
      PERMISSION_WAREHOUSE.WAREHOUSE_CANCEL_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_REPORT_LIST,
      PERMISSION_WAREHOUSE.WAREHOUSE_REPORT_EXPORT,
    ]),
    excludes: getValueFromArray([
      PERMISSION_DASHBOARD.DASHBOARD_WAREHOUSING,
      PERMISSION_DRUG.DRUG_GROUP_DELETE,
      PERMISSION_DRUG.DRUG_CATEGORY_DELETE,
      PERMISSION_PRODUCT.PRODUCT_GROUP_DELETE,
      PERMISSION_PRODUCT.PRODUCT_CATEGORY_DELETE,
      PERMISSION_SALES.SALES_PAYMENT_HISTORY_EXPORT,
      PERMISSION_SALES.SALES_PAYMENT_HISTORY_LIST,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_BANK,
      PERMISSION_MANAGE_GENERAL.MANAGE_GENERAL_VNPAY,
    ]),
  },
};
