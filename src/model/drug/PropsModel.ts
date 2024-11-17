import { IFieldCustomize, IFormData, IValidation } from "model/FormModel";
import { IOption, ITabContent } from "model/OtherModel";
import { IFormDataExchange } from "./OtherModel";
import { ICategory } from "./response/CategoryModelResponse";
import { IDrugMaster } from "./response/DrugMasterModelResponse";
import { IDrug } from "./response/DrugModelResponse";
import { IGroup } from "./response/GroupModelResponse";

export interface AddDrugModalProps {
  onShow: boolean;
  id?: number;
  isDrug: boolean;
  onHide: (reload: boolean) => void;
}

export interface AddDrugProps {
  tabActive?:ITabContent,
  errorBridge?:Record<string, string>[],
  isDrug?: boolean;
  dataDrug?: IDrug;
  formData?: IFormData;
  listCategory?: IOption[];
  setListCategory?: (data: IOption[]) => void;
  listGroup?: IOption[];
  setListGroup?: (data: IOption[]) => void;
  listUnit?: IOption[];
  setListUnit?: (data: IOption[]) => void;
  listFormUnitExchange?: IFormDataExchange[];
  setListFormUnitExchange?: (formUnitExchange: IFormDataExchange[]) => void;
  handleUpdate: (formData: IFormData) => void;
  handleSubmit: any;
  drugMasterData?: IDrugMaster;
}

export interface AddGroupModalProps {
  onShow: boolean;
  data?: ICategory | IGroup;
  isDrug: boolean;
  isGroup: boolean;
  onHide: (reload: boolean) => void;
}

export interface UnitExchangeProps {
  item: IFormDataExchange;
  formData: IFormData;
  listFormUnitExchange: IFormDataExchange[];
  validationsUnit: IValidation[];
  listFieldUnitExchange: IFieldCustomize[];
  handleUpdate: (formUnit: IFormDataExchange) => void;
}

export interface DrugDetailProps {
  data: IDrug;
  isDrug: boolean;
  onShow: boolean;
  onHide: (idEdit?: number) => void;
}

export interface DrugGroupDetailProps {
  data: IGroup | ICategory;
  isDrug: boolean;
  isGroup: boolean;
  onShow: boolean;
  onHide: () => void;
}

export interface DrugMasterDataProps {
  onShow: boolean;
  onHide: () => void;
  callback?: (item: IDrugMaster) => void;
}
