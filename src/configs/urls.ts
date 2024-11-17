import { filter } from "lodash";

export const urlsApi = {
  user: {
    login: "/api/v3/auth/login",
    logout: "/api/v3/auth/logout",
    refresh: "/api/v2/user/refresh",
    changePass: "/api/user/change-pass",
    list: "/api/v3/user/list",
    update: "/api/user/update",
    settings: "/api/v2/user/settings",
    forgotPassword: "/api/forgotPassword",
    getNotification: "/api/v2/dashboard/notification",
    readNotification: "/api/v2/dashboard/notification/read",
  },
  order: {
    warningOrder: "/api/v3/dashboard/warningquantity?detail=true",
    save: "/api/v3/order/save",
  },
  drug: {
    filter: "/api/v3/drug/filter",
    filterDrugMaster: "/api/v3/drug/filter-master-data",
    filterForSale: "/api/v3/drug/filter-for-sale",
    filterForWarehousing: "/api/v3/drug/autoListFavorite/search",
    detail: "/api/v3/drug/detail",
    updateStatus: "/api/v3/drug/updateStatus",
    delete: "/api/v3/drug/delete",
    save: "/api/v3/drug/save",
    export: "/api/v3/drug/export",
  },
  category: {
    filter: "/api/v3/category/filter",
    save: "/api/v3/category/save",
    delete: "/api/v3/category/delete",
    export: "/api/v3/category/export",
  },
  group: {
    filter: "/api/v3/group/filter",
    save: "/api/v3/group/save",
    delete: "/api/v3/group/delete",
    export: "/api/v3/group/export",
  },
  unit: {
    list: "/api/v3/unit/list",
  },
  invoice: {
    filter: "/api/v3/invoice/filter",
    filterTemp: "/api/v3/invoice/list-tmp",
    tempDetail: "/api/v3/invoice_tmp/detail",
    detail: "/api/v3/invoice/detail",
    export: "/api/v3/invoice/export",
    exportTemp: "/api/v3/invoice/list-tmp/export",
    detailShort: "/api/v3/invoice/detail-short",
    shippingShell: "/api/v3/invoice/shipping-sell",
    updateInvoiceStatus: "/api/v3/invoice/update-status",
    save: "/api/v3/invoice/save",
    createIV1: "/api/v3/invoice/createIV1",
    warehousing: "/api/v3/invoice/warehousing",
    warehousingTemp: "/api/v3/invoice/warehousingtemp",
    historyPayment: "/api/v3/invoice/history-payment",
    paymentDebt: "/api/v3/invoice/payment-debt",
  },
  supplier: {
    list: "/api/v3/supplier",
    listFilter: "/api/v3/master/supplier/list",
    create: "/api/v3/supplier",
    export: "/api/v3/master/supplier/list/export",
  },
  customer: {
    filter: "/api/v3/customer/filter",
    save: "/api/v3/customer",
  },
  warehouse: {
    invoices: {
      filter: "/api/v3/warehouse/invoices/filter",
      export: "/api/v3/warehouse/invoices/export",
      cancelExport: "/api/v3/invoice/export",
      delete: "/api/v3/invoice/invoice_tmp",
      filterForWarehousing: "/api/v3/warehouse/autoListWithPackages4SaleFavorite",
    },
    inventory: {
      filter: "/api/v3/warehouse/stockList",
      export: "/api/v3/warehouse/export",
    },
    statistic: "/api/v3/invoice/warehousingstatistic",
    inOut: "/api/v3/warehouse/inOut",
    updateStatus: "/api/v3/invoice/update-status",
    voucherCheck: "/api/vouchers_check",
    voucherCheckById: "/api/v3/warehouse/getListUnitByDrug4Sale",
    voucherCheckStatus: "/api/v3/report/voucherscheck/check",
    voucherCheckCreate: "/api/v3/vouchers_check",
  },
  report: {
    revenue: {
      filter: "/api/v3/report/revenue",
      export: "/api/v3/report/revenue/export",
    },
    warehouseSell: {
      filter: "/api/v3/report/goods-in-out",
      export: "/api/v3/report/warehouse-sell/export",
    },
    adminWarehouse: {
      filter: "/api/v3/report/admin-warehouse",
      export: "/api/v3/report/warehouse-sell/export",
    },
    revenueProfit: {
      filter: "/api/v3/report/revenue-profit",
      export: "/api/v3/report/revenue-profit/export",
    },
    salePerson: {
      filter: "/api/v3/report/sale-person",
      export: "/api/v3/report/sale-person/export",
    },
  },
  cashbook: {
    filter: "/api/v3/cashbook/list",
    getCode: "/api/v3/cashbook/code",
    save: "/api/v3/cashbook/save",
    export: "/api/v3/cashbook/list-export",
  },
};

export const urls = {
  dashboard: "/dashboard",
  drug: {
    list: "/drugs",
    listGroup: "/drug/groups",
    listCategory: "/drug/categories",
  },
  product: {
    list: "/products",
    listGroup: "/product/groups",
    listCategory: "/product/categories",
  },
  sales: {
    create: "/sales/create",
    invoices: "/sales/invoices",
    returns: "/sales/returns",
    temp: "/sales/temp",
    statistic: "/sales/statistic",
    historical: "/sales/historical",
  },
  warehousing: {
    invoices: "/warehousing/invoices",
    inventory: "/warehousing/inventory",
    returns: "/warehousing/returns",
    create: "/warehousing/create",
    temp: "/warehousing/temp",
    statistic: "/warehousing/statistic",
  },
  warehouse: {
    invoiceImport: "/warehouse/import",
    invoiceExport: "/warehouse/export",
    inventory: "/warehouse/inventory",
    checkInventory: "/warehouse/check-inventory",
    exportCancel: "/warehouse/export-cancel",
    report: "/warehouse/report",
  },
  order: {
    list: "/order/list",
    create: "/order/create",
    temp: "/order/temp",
  },
  cashbook: {
    list: "/cashbook",
    receipt: "/cashbook/receipt",
    payslip: "/cashbook/pay-slip",
  },
  report: {
    revenue: "/report/revenue",
    adminRealRevenue: "/report/admin/real-revenue",
    adminProfitRevenue: "/report/admin/profit-revenue",
    adminSales: "/report/admin/sales",
    adminSalesDetail: "/report/admin/salesDetail",
    adminWarehouse: "/report/admin/warehouse",
    healthFacilitiesSalesPrescription: "/report/health-facilities/sales-prescription",
    healthFacilitiesQualityControl: "/report/health-facilities/quality-control",
    healthFacilitiesSpecialControl: "/report/health-facilities/special-control",
    revenueProfit: "/report/revenue-profit",
    salePerson: "/report/sale-person",
    warehouseSell: "/report/warehouse-sell",
  },
};

export default urls;

export const urlsFormData = [urlsApi.drug.save];
