import { ICustomer } from "./response/CustomerResponseModel";

export interface AddCustomerProps {
  onShow: boolean;
  data?: ICustomer;
  onHide: (data?: ICustomer) => void;
}
