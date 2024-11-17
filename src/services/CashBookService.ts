import { ICashBookModelResponse } from './../model/cashBook/response/cashBookModelResponse';
import { urlsApi } from "configs/urls";
import { convertParamsToString } from "utils/common";

export default {
  getList: (params: any, signal?: AbortSignal, type?: string) => {
    return fetch(`${urlsApi.cashbook.filter}${convertParamsToString(params)}${type ? `&type=${type}`:""}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  getCode: (type?: string) => {
    return fetch(`${urlsApi.cashbook.getCode}/${type}`, {
      method: "GET",
    }).then((res) => res.json());
  },
  save: (body) => {
    return fetch(`${urlsApi.cashbook.save}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  export: (body: any) => {
    return fetch(`${urlsApi.cashbook.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
};
