import { urlsApi } from "configs/urls";
import { ICategoryRequest } from "model/drug/request/CategoryModelRequest";
import { convertParamsToString } from "utils/common";

export default {
  filter: (params: any, signal?: AbortSignal) => {
    return fetch(`${urlsApi.category.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  export: (body: any) => {
    return fetch(`${urlsApi.category.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  save: (body: ICategoryRequest) => {
    return fetch(urlsApi.category.save, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  delete: (id: number) => {
    return fetch(`${urlsApi.category.delete}/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
  },
};
