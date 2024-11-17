import { IFormData } from "model/FormModel";

export interface IFormDataExchange extends IFormData {
  uuid: string;
  active: boolean;
}