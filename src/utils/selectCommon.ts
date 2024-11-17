import CategoryService from "services/CategoryService";
import CustomerService from "services/CustomerService";
import GroupService from "services/GroupService";
import UnitService from "services/UnitService";
import UserService from "services/UserService";
import { showToast } from "./common";
import SupplierService from "services/SupplierService";

// Function lấy dữ liệu danh sách từ service
export async function SelectOptionData(key: string, params?: any) {
  let response = null;
  params = { ...params, limit: 10000 };
  switch (key) {
    case "category":
      response = await CategoryService.filter(params);
      break;
    case "group":
      response = await GroupService.filter(params);
      break;
    case "unit":
      response = await UnitService.list(params);
      break;
    case "supplier_id":
      response = await SupplierService.listFilter(params);
      break;
    case "customer":
      response = await CustomerService.filter(params);
      break;
    case "user":
    case "created_by":
    case "sale":
      response = await UserService.list(params);
      break;
  }
  if (response) {
    if (response.code === 200) {
      return [...(response.result.data ? response.result.data : response.result)].map((item) => {
        return { value: item.id, label: item.name };
      });
    } else {
      showToast(response.message, "error");
    }
    return [];
  }
}
