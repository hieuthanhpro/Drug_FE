import { stepForgot } from "../DataModelInitial";

export interface IUserLoginRequest {
  username: string;
  password: string;
}

export interface IForgotRequest {
  username?: string;
  phone_number: string;
  otp: string;
  password: string;
  password_confirmation: string;
  type: string;
}

export const formForgotDefault: IForgotRequest = {
  phone_number: "",
  otp: "",
  password: "",
  password_confirmation: "",
  type: stepForgot.verified_phone,
};
