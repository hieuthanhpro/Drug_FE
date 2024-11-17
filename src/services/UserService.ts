import { urlsApi } from "configs/urls";
import { stepForgot } from "model/user/DataModelInitial";
import { IUserLoginRequest, IForgotRequest } from "model/user/request/UserRequestModel";
import { convertParamsToString } from "utils/common";

export default {
  login: (loginInfo: IUserLoginRequest) => {
    return fetch(urlsApi.user.login, {
      method: "POST",
      body: JSON.stringify({
        username: loginInfo.username,
        password: loginInfo.password,
        type: process.env.APP_TYPE,
      }),
    }).then((res) => res.json());
  },
  logout: () => {
    return fetch(urlsApi.user.logout, { method: "POST" }).then((res) => res.json());
  },
  refreshToken: () => {
    return fetch(urlsApi.user.refresh, {
      method: "POST",
    }).then((res) => res.json());
  },
  forgotPassword: (forgotInfo: IForgotRequest, resend: boolean) => {
    return fetch(urlsApi.user.forgotPassword, {
      method: "POST",
      body: JSON.stringify({ ...forgotInfo, type: resend ? stepForgot.resend_otp : forgotInfo.type }),
    }).then((res) => res.json());
  },
  getNotification: (params: any) => {
    return fetch(`${urlsApi.user.getNotification}${convertParamsToString(params)}`, {
      method: "GET",
    }).then((res) => res.json());
  },
  readNotification: (id: number) => {
    return fetch(`${urlsApi.user.readNotification}/${id}`, {
      method: "GET",
    }).then((res) => res.json());
  },
  list: (params: any, signal?: AbortSignal) => {
    return fetch(`${urlsApi.user.list}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
};
