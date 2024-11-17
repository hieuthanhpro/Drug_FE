import { urlsApi } from "configs/urls";
import { ICustomerRequest } from "model/customer/request/CustomerRequestModel";
import { ISupplierRequest } from "model/supplier/request/SupplierRequestModel";
import { convertParamsToString } from "utils/common";

export default {
  list: (params: any, signal?: AbortSignal) => {
    return fetch(`${urlsApi.supplier.list}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  listFilter: (params: any, signal?: AbortSignal) => {
    return fetch(`${urlsApi.supplier.listFilter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  create: (body : ISupplierRequest) => {
    return fetch(urlsApi.supplier.create, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  update: (body : ISupplierRequest, id: string) => {
    return fetch(`${urlsApi.supplier.create}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  export: (body: any) => {
    return fetch(`${urlsApi.supplier.export}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
};
