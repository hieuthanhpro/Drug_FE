import { urlsApi } from "configs/urls";
import { ICustomerRequest } from "model/customer/request/CustomerRequestModel";
import { convertParamsToString } from "utils/common";

export default {
  filter: (params: any, signal?: AbortSignal) => {
    return fetch(`${urlsApi.customer.filter}${convertParamsToString(params)}`, {
      signal,
      method: "GET",
    }).then((res) => res.json());
  },
  save: (body: ICustomerRequest) => {
    return fetch(`${urlsApi.customer.save}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
};
