import { IOption } from "model/OtherModel";
import moment from "moment";
import { IInvoiceTab } from "./OtherModel";
import { IBillInfo, ICombo, IItemSale, IPrescription } from "./request/SalesInvoiceModelRequest";

export const saleInvoiceStatus = {
  processing: "Đang xử lý",
  done: "Hoàn thành",
  cancel: "Đã hủy",
  temp: "Lưu tạm",
};

export const warehousingInvoiceStatus = {
  done: "Hoàn thành",
  cancel: "Đã hủy",
  pending: "Cần xác nhận",
  temp: "Lưu tạm",
};

export const invoiceMethods: IOption[] = [
  {
    value: "direct",
    label: "Trực tiếp",
  },
  {
    value: "online",
    label: "Online",
  },
];

export const listVat: IOption[] = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 5,
    label: "5%",
  },
  {
    value: 8,
    label: "8%",
  },
  {
    value: 10,
    label: "10%",
  },
];

export const defaultBillInfo: IBillInfo = {
  method: "direct",
  payment_method: "cash",
  discount_type: "amount",
  amount: 0,
  discount: 0,
  discount_rate: 0,
  pay_amount: 0,
  receipt_date: moment().format("DD/MM/yyyy").toString(),
};

export const defaultSalesItem: IItemSale = {
  expiry_date: "",
  number: "",
  price: 0,
  quantity: 1,
  total_amount: 0,
  unit_id: 0,
  vat: 0,
  warehouse_quantity: 0
};

export const defaultComboInfo: ICombo = {
  combo_name: "",
  price: 0,
  quantity: 1,
  total_amount: 0,
  note: "",
};

export const defaultPrescription: IPrescription = {
  name_patient: "",
  age_select: "year",
};

export const defaultTabInvoice: IInvoiceTab = {
  is_active: true,
  bill_info: {
    data: defaultBillInfo,
    values: defaultBillInfo,
  },
  forms_data: [],
};

export const SalesMethods: IOption[] = [
  {
    value: "direct",
    label: "Trực tiếp",
  },
  {
    value: "online",
    label: "Online",
  },
];

export const CashbookTypes:IOption[]=[
  {
    value: "phiếu chi",
    label: "Phiếu chi",
  },
  {
    value: "phiếu thu",
    label: "Phiếu thu",
  },
]

export const PaymentMethods: IOption[] = [
  {
    value: "cash",
    label: "Tiền mặt",
  },
  {
    value: "banking",
    label: "Chuyển khoản",
  },
  {
    value: "card",
    label: "Thẻ (máy POS)",
  },
  {
    value: "momo",
    label: "Momo",
  },
  {
    value: "vnpay",
    label: "VNPay",
  },
  {
    value: "other",
    label: "Hình thức khác",
  },
];
