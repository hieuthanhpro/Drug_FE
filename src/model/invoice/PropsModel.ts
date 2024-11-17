import { IOption } from "model/OtherModel";
import { IInvoiceTab } from "./OtherModel";
import { IBillInfoFormData, IFormDataItemSale, IFormDataLineItemSale } from "./request/SalesInvoiceModelRequest";
import { ISalesItemModalResponse } from "./response/SalesInvoiceModelResponse";

export interface SalesCreateProps {
  type?: string;
}

export interface SalesTabProps {
  listTabInvoice: IInvoiceTab[];
  updateTabInvoice: (listTabInvoice: IInvoiceTab[]) => void;
}

export interface SalesLineItemProps {
  formData: IFormDataLineItemSale;
  setFormData: (data: IFormDataLineItemSale) => void;
  onRemove: () => void;
  onChooseDrugForSale: () => void;
  handleSubmitRef: any;
}

export interface SalesItemProps {
  formDataCombo?: IFormDataLineItemSale;
  formData: IFormDataItemSale;
  typeItem: "retail" | "combo" | "prescription";
  setFormData: (data: IFormDataItemSale) => void;
  onRemove: () => void;
  handleSubmitRefSaleItem: any;
  type?: "order" | "warehouse";
}

export interface SalesItemUnitProps {
  formDataCombo?: IFormDataLineItemSale;
  formData: IFormDataItemSale;
  typeItem: "retail" | "combo" | "prescription";
  setFormData: (data: IFormDataItemSale) => void;
  handleSubmitRefSaleItem: any;
  type?: "order" | "warehouse";
}

export interface SalesComboPrescriptionProps {
  formData: IFormDataLineItemSale;
  setFormData: (data: IFormDataLineItemSale) => void;
  onRemove: () => void;
  onChooseDrugForSale: () => void;
  handleSubmitRefSaleComboItem: any;
}

export interface ChooseSalesItemModalProps {
  onShow: boolean;
  onHide: () => void;
  callback?: (data: ISalesItemModalResponse) => void;
  type?: string
}

export interface SalesItemModalProps {
  data: ISalesItemModalResponse;
  callback: () => void;
  type:string
}

export interface BillInfoProps {
  lineItems: IFormDataLineItemSale[],
  listCustomer: IOption[];
  formData: IBillInfoFormData;
  handleUpdate: (billDataFormData: IBillInfoFormData) => void;
  updateListCustomer: (listCustomer: IOption[]) => void;
  handleSubmit: any;
  handleSubmitRef: any;
  type?: "DH" | "warehouse";
}
