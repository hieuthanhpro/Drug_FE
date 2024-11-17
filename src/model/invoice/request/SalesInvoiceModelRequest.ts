import { IFormData } from "model/FormModel";
import { ISalesItemModalResponse } from "../response/SalesInvoiceModelResponse";

export interface IInvoiceSalesRequest extends IBillInfo {
  line_items: ILineItem[];
  promotion_ids?: number[];
  gift_items?: any[];
}

export interface IBillInfo {
  receipt_date?: string;
  customer_id?: number;
  method: "direct" | "online";
  payment_method: "cash" | "banking" | "card" | "momo" | "vnpay" | "other";
  discount_type: "amount" | "percentage";
  discount?: number;
  discount_rate?: number;
  amount?: number;
  pay_amount?: number;
  description?: string;
  vat_amount?: number;
  discount_promotion?: number;
}

export interface ILineItem extends ICombo, IPrescription {
  items?: IItemSale[];
}
export interface IItemSale {
  drug?: ISalesItemModalResponse;
  drug_id: number;
  number: string;
  unit_id: number;
  combo_quantity?: number;
  quantity: number;
  expiry_date: string;
  price: number;
  discount_promotion?: number;
  discount?: number;
  discount_percentage?: number;
  vat: number;
  total_amount: number;
  note?: string;
  warehouse_quantity: number;
}

export interface IPrescription {
  patient_code?: string;
  name_patient?: string;
  age_select?: "year" | "month";
  year_old?: number;
  month_old?: number;
  height?: number;
  weight?: number;
  id_card?: string;
  bhyt?: string;
  patient_address?: string;
  doctor?: string;
  caregiver?: string;
  code_invoice?: string;
  created_at?: string;
  clinic?: string;
  address?: string;
  image?: string;
}

export interface ICombo {
  combo_name?: string;
  quantity?: number;
  price?: number;
  total_amount?: number;
  note?: string;
}

export interface IBillInfoFormData extends IFormData {
  data: IBillInfo;
}

export interface ILineItemFormData extends IFormData {
  items?: IFormDataItemSale[];
  combo_info?: ICombo;
  prescription?: IPrescription;
}

export interface IFormDataLineItemSale extends ILineItemFormData {
  uuid: string;
  type_item: "retail" | "combo" | "prescription";
  drug_store?: any
}

export interface IFormDataItemSale extends IFormData {
  uuid: string;
  data: IItemSale;
}
