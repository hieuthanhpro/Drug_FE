import { urlsApi } from "configs/urls";
import { IGroupRequest } from "model/drug/request/GroupModelRequest";
import { convertParamsToString } from "utils/common";

export default {
  filter: (params: any, signal?: AbortSignal) => {
    return fetch(`${urlsApi.group.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  export: (body: any) => {
    return fetch(`${urlsApi.group.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  save: (body: IGroupRequest) => {
    return fetch(urlsApi.group.save, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  delete: (id: number) => {
    return fetch(`${urlsApi.group.delete}/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
  },
};
