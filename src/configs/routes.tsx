import React from "react";
import Icon from "components/icon";
import Dashboard from "pages/dashboard/index";
import DrugList, { ProductList } from "pages/drug/DrugList";
import DrugGroupList, { DrugCategoryList, ProductCategoryList, ProductGroupList } from "pages/drug/DrugGroupList";
import SalesInvoices, { SalesHistorical, SalesInvoicesMoney, SalesInvoicesReturn, SalesInvoicesTemp } from "pages/sales/SalesInvoices";
import { IMenuItem, IRouter } from "model/OtherModel";
import urls from "./urls";
import { PERMISSION_DRUG } from "permissions/resources/drug";
import { PERMISSION_PRODUCT } from "permissions/resources/product";
import {
  PERMISSION_SALES,
  PERMISSION_SALES_INVOICES,
  PERMISSION_SALES_STATISTIC,
  PERMISSION_SALES_TEMP,
} from "permissions/resources/sales";
import {
  PERMISSION_WAREHOUSING_INVOICES,
  PERMISSION_WAREHOUSING_STATISTIC,
  PERMISSION_WAREHOUSING_TEMP,
} from "permissions/resources/warehousing";
import WarehousingInvoices, {
  WarehousingInvoicesReturn,
  WarehousingInvoicesStatistical,
  WarehousingInvoicesTemp,
} from "pages/warehousing/WarehousingInvoices";
import WarehouseInventory, { WarehouseInventoryReport } from "pages/warehouse/WarehouseInventory";
import WarehouseInvoices, {
  WarehouseInvoicesCancle,
  WarehouseInvoicesCheck,
  WarehouseInvoicesExport,
} from "pages/warehouse/WarehouseInvoices";
import SalesCreate from "pages/sales/SalesCreate";
import CashBook from "pages/cashBook/CashBook";
import ReportWarehouseSell from "pages/Report/ReportWarehouseSell";
import ReportSalePerson from "pages/Report/ReportSalePerson";
import ReportRevenueProfit from "pages/Report/ReportRevenueProfit";
import ReportRevenue from "pages/Report/ReportRevenue";
import CashBookReceipt, { CashBookPayment } from "pages/cashBook/CashBookReceipt";
import OrderCreate from "pages/order/OrderCreate";
import { PERMISSION_ORDER } from "permissions/resources/order";
import OrderInvoice, { OrderInvoiceTemp } from "pages/order/OrderInvoice";
import WarehousingCreate from "pages/warehousing/WarehousingCreate";
import ReportAdminWarehouse from "pages/Report/ReportAdminWarehouse";
import ReportOrderTracking from "pages/Report/ReportOrderTracking";
import ReportQualityControl from "pages/Report/ReportQualityControl";
import ReportControlDrug from "pages/Report/ReportControlDrug";
export const menu: IMenuItem[] = [
  {
    title: "Trang chủ",
    path: urls.dashboard,
    icon: <Icon name="Home" />,
  },
  {
    title: "Thuốc",
    path: urls.drug.list,
    icon: <Icon name="Drug" />,
    children: [
      {
        title: "Danh sách thuốc",
        path: urls.drug.list,
        permission: [PERMISSION_DRUG.DRUG_LIST],
      },
      {
        title: "Nhóm thuốc",
        path: urls.drug.listGroup,
        permission: [PERMISSION_DRUG.DRUG_GROUP_LIST],
      },
      {
        title: "Danh mục thuốc",
        path: urls.drug.listCategory,
        permission: [PERMISSION_DRUG.DRUG_CATEGORY_LIST],
      },
    ],
  },
  {
    title: "SP không phải thuốc",
    path: urls.product.list,
    icon: <Icon name="MedicalBox" />,
    children: [
      {
        title: "Danh sách sản phẩm",
        path: urls.product.list,
        permission: [PERMISSION_PRODUCT.PRODUCT_LIST],
      },
      {
        title: "Nhóm sản phẩm",
        path: urls.product.listGroup,
        permission: [PERMISSION_PRODUCT.PRODUCT_GROUP_LIST],
      },
      {
        title: "Danh mục sản phẩm",
        path: urls.product.listCategory,
        permission: [PERMISSION_PRODUCT.PRODUCT_CATEGORY_LIST],
      },
    ],
  },
  {
    title: "Bán hàng",
    path: urls.sales.invoices,
    icon: <Icon name="SaleDrug" />,
    children: [
      {
        title: "Bán hàng",
        path: urls.sales.create,
        permission: [PERMISSION_SALES.SALES_ADD],
      },
      {
        title: "Hóa đơn bán hàng",
        path: urls.sales.invoices,
        permission: [PERMISSION_SALES_INVOICES.SALES_INVOICES_LIST],
      },
      {
        title: "Hóa đơn khách trả hàng",
        path: urls.sales.returns,
        permission: [PERMISSION_SALES_INVOICES.SALES_INVOICES_RETURN],
      },
      {
        title: "Thống kê doanh thu",
        path: "/sales/statistic",
      },
      {
        title: "Đơn bán lưu tạm",
        path: urls.sales.temp,
        permission: [PERMISSION_SALES_TEMP.SALES_TEMP_LIST],
      },
      {
        title: "Lịch sử bán hàng",
        path: urls.sales.historical,
      },
    ],
  },
  {
    title: "Nhập hàng",
    path: "/warehousing/invoices",
    icon: <Icon name="Login" />,
    children: [
      {
        title: "Tạo đơn nhập hàng",
        path: "/warehousing/create",
      },
      {
        title: "Hóa đơn nhập hàng",
        path: urls.warehousing.invoices,
        permission: [PERMISSION_WAREHOUSING_INVOICES.WAREHOUSING_INVOICES_LIST],
      },
      {
        title: "Trả hàng NCC",
        path: urls.warehousing.returns,
        permission: [PERMISSION_WAREHOUSING_INVOICES.WAREHOUSING_INVOICES_RETURN],
      },
      {
        title: "Thống kê nhập hàng",
        path: "/warehousing/statistic",
      },
      {
        title: "Đơn nhập lưu tạm",
        path: "/warehousing/temp",
      },
    ],
  },
  {
    title: "Đặt hàng",
    path: "/order/list",
    icon: <Icon name="FingerTouch" />,
    children: [
      {
        title: "Tạo đơn đặt hàng",
        path: "/order/create",
      },
      {
        title: "Danh sách đơn đặt hàng",
        path: "/order/list",
      },
      {
        title: "Đơn đặt lưu tạm",
        path: "/order/temp",
      },
    ],
  },
  //Warehouse
  {
    title: "Kho hàng",
    path: urls.warehouse.invoiceImport,
    icon: <Icon name="Warehouse" />,
    children: [
      {
        title: "Phiếu nhập kho",
        path: urls.warehouse.invoiceImport,
      },
      {
        title: "Phiếu xuất kho",
        path: urls.warehouse.invoiceExport,
      },
      {
        title: "Quản lý tồn kho",
        path: urls.warehouse.inventory,
      },
      {
        title: "Kiểm kho",
        path: urls.warehouse.checkInventory,
      },
      {
        title: "Xuất hủy",
        path: urls.warehouse.exportCancel,
      },
      {
        title: "Báo cáo xuất nhập tồn",
        path: urls.warehouse.report,
      },
    ],
  },
  {
    title: "Báo cáo",
    path: "/report",
    icon: <Icon name="Report" />,
    children: [
      {
        title: "Báo cáo quản trị",
        path: "/report/admin",
        children:[
          {
            title: "Doanh thu thực",
            path: "/report/admin/real-revenue",
          },
          {
            title: "Doanh thu-Lợi nhuộn gộp",
            path: "/report/admin/profit-revenue",
          },
          {
            title: "Doanh số bán hàng",
            path: "/report/admin/sales",
          },
          {
            title: "Chi tiết Nhập - Bán hàng",
            path: "/report/admin/salesDetail",
          },
          {
            title: "Báo cáo xuất nhập tồn",
            path: "/report/admin/warehouse",
          },
        ]
      },
     
      {
        title: "Báo cáo cơ sở y tế",
        path: "/report/health-facilities",
        children:[
          {
            title: "Theo dõi bán theo đơn",
            path: "/report/health-facilities/sales-prescription",
          },
          {
            title: "Sổ kiểm soát chất lượng",
            path: "/report/health-facilities/quality-control",
          },
          {
            title: "Thuốc kiểm soát đặc biệt",
            path: "/report/health-facilities/special-control",
          },
        ]
      },
     
    ],
  },
  {
    title: "Sổ quỹ",
    path: "/cashbook",
    icon: <Icon name="Book" />,
    children: [
      {
        title: "Xem sổ quỹ",
        path: "/cashbook",
      },
      {
        title: "Danh sách phiếu thu",
        path: "/cashbook/receipt",
      },
      {
        title: "Danh sách phiếu chi",
        path: "/cashbook/pay-slip",
      },
    ],
  },
  {
    title: "Cài đặt",
    path: "/settings",
    icon: <Icon name="Settings" />,
    children: [],
  },
];

export const routes: IRouter[] = [
  // Dashboard
  {
    path: "",
    component: <Dashboard />,
  },
  {
    path: urls.dashboard,
    component: <Dashboard />,
  },
  // Drug
  {
    path: urls.drug.list,
    component: <DrugList />,
    permission: [PERMISSION_DRUG.DRUG_LIST],
  },
  {
    path: urls.drug.listGroup,
    component: <DrugGroupList />,
    permission: [PERMISSION_DRUG.DRUG_GROUP_LIST],
  },
  {
    path: urls.drug.listCategory,
    component: <DrugCategoryList />,
    permission: [PERMISSION_DRUG.DRUG_CATEGORY_LIST],
  },
  // Product
  {
    path: urls.product.list,
    component: <ProductList />,
    permission: [PERMISSION_PRODUCT.PRODUCT_LIST],
  },
  {
    path: urls.product.listGroup,
    component: <ProductGroupList />,
    permission: [PERMISSION_PRODUCT.PRODUCT_GROUP_LIST],
  },
  {
    path: urls.product.listCategory,
    component: <ProductCategoryList />,
    permission: [PERMISSION_PRODUCT.PRODUCT_CATEGORY_LIST],
  },
  // Sales
  {
    path: urls.sales.create,
    component: <SalesCreate />,
    permission: [PERMISSION_SALES.SALES_ADD],
  },
  //order
  {
    path: urls.order.create,
    component: <OrderCreate />,
    permission: [PERMISSION_ORDER.ORDER_ADD],
  },
  {
    path: urls.order.list,
    component: <OrderInvoice />,
    permission: [PERMISSION_ORDER.ORDER_LIST],
  },
  {
    path: urls.order.temp,
    component: <OrderInvoiceTemp />,
    permission: [PERMISSION_ORDER.ORDER_LIST],
  },
  {
    path: urls.sales.invoices,
    component: <SalesInvoices />,
    permission: [PERMISSION_SALES_INVOICES.SALES_INVOICES_LIST],
  },
  {
    path: urls.sales.returns,
    component: <SalesInvoicesReturn />,
    permission: [PERMISSION_SALES_INVOICES.SALES_INVOICES_RETURN],
  },
  {
    path: urls.sales.temp,
    component: <SalesInvoicesTemp />,
    permission: [PERMISSION_SALES_TEMP.SALES_TEMP_LIST],
  },
  {
    path: urls.sales.statistic,
    component: <SalesInvoicesMoney />,
    permission: [PERMISSION_SALES_STATISTIC.SALES_STATISTIC_LIST],
  },
  {
    path: urls.sales.historical,
    component: <SalesHistorical />,
  },
  // Warehousing
  {
    path: urls.warehousing.create,
    component: <WarehousingCreate />,
    permission: [PERMISSION_WAREHOUSING_INVOICES.WAREHOUSING_INVOICES_PRINT],
  },
  {
    path: urls.warehousing.invoices,
    component: <WarehousingInvoices />,
    permission: [PERMISSION_WAREHOUSING_INVOICES.WAREHOUSING_INVOICES_LIST],
  },
  {
    path: urls.warehousing.returns,
    component: <WarehousingInvoicesReturn />,
    permission: [PERMISSION_WAREHOUSING_INVOICES.WAREHOUSING_INVOICES_RETURN],
  },
  {
    path: urls.warehousing.temp,
    component: <WarehousingInvoicesTemp />,
    permission: [PERMISSION_WAREHOUSING_TEMP.WAREHOUSING_TEMP_LIST],
  },
  {
    path: urls.warehousing.statistic,
    component: <WarehousingInvoicesStatistical />,
    permission: [PERMISSION_WAREHOUSING_STATISTIC.WAREHOUSING_STATISTIC_LIST],
  },
  //Warehouse
  {
    path: urls.warehouse.invoiceImport,
    component: <WarehouseInvoices />,
  },
  {
    path: urls.warehouse.invoiceExport,
    component: <WarehouseInvoicesExport />,
  },
  {
    path: urls.warehouse.inventory,
    component: <WarehouseInventory />,
  },
  {
    path: urls.warehouse.checkInventory,
    component: <WarehouseInvoicesCheck />,
  },
  {
    path: urls.warehouse.exportCancel,
    component: <WarehouseInvoicesCancle />,
  },
  {
    path: urls.warehouse.report,
    component: <WarehouseInventoryReport />,
  },
  {
    path: "content",
    component: <Dashboard />,
  },
  {
    path: "users",
    component: <Dashboard />,
  },
  {
    path: "settings",
    component: <Dashboard />,
  },
  // cashbook
  {
    path: urls.cashbook.list,
    component: <CashBook />,
  },
  {
    path: urls.cashbook.receipt,
    component: <CashBookReceipt />,
  },
  {
    path: urls.cashbook.payslip,
    component: <CashBookPayment />,
  },
  //Report
  {
    path: urls.report.adminRealRevenue,
    component: <ReportRevenue />,
  },
  {
    path: urls.report.adminProfitRevenue,
    component: <ReportRevenueProfit />,
  },
  {
    path: urls.report.adminSales,
    component: <ReportSalePerson />,
  },
  {
    path: urls.report.adminSalesDetail,
    component: <ReportWarehouseSell />,
  },
  {
    path: urls.report.adminWarehouse,
    component: <ReportAdminWarehouse />,
  },
  {
    path: urls.report.healthFacilitiesSalesPrescription,
    component: <ReportOrderTracking />,
  },
  {
    path: urls.report.healthFacilitiesQualityControl,
    component: <ReportQualityControl />,
  },
  {
    path: urls.report.healthFacilitiesSpecialControl,
    component: <ReportControlDrug />,
  },
];
