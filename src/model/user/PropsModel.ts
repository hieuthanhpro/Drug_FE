import { IUserLoginRequest } from "./request/UserRequestModel";

export interface ForgotPasswordProps {
  isForgotPassword: boolean;
  setIsForgotPassword: (value: boolean) => void;
  setLoginInfo: (loginInfo: IUserLoginRequest) => void;
}