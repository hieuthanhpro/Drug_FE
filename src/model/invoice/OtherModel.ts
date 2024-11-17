import { IBillInfoFormData, IFormDataLineItemSale } from "./request/SalesInvoiceModelRequest";

export interface IInvoiceTab {
  is_active: boolean;
  bill_info: IBillInfoFormData;
  forms_data: IFormDataLineItemSale[];
  promotion_ids?: number[];
}
