import { ISortItem, ITabContent } from "model/OtherModel";

export const tabListDefault: ITabContent[] = [
  {
    value: "general",
    label: "Thông tin cơ bản",
    active: true,
  },
  {
    value: "unit_price",
    label: "Đơn vị quy đổi và giá bán",
    active: false,
  },
  {
    value: "warning",
    label: "Cảnh báo",
    active: false,
  },
];

export const sortDrugList: ISortItem[] = [
  { value: "", label: "Mặc định" },
  { value: "drug_name_asc", label: "Tên sản phẩm A - Z" },
  { value: "drug_name_desc", label: "Tên sản phẩm Z - A" },
  { value: "drug_code_asc", label: "Mã sản phẩm A - Z" },
  { value: "drug_code_desc", label: "Mã sản phẩm Z - A" },
  { value: "bar_code_asc", label: "Mã vạch A - Z" },
  { value: "bar_code_desc", label: "Mã vạch Z - A" },
  { value: "unit_name_asc", label: "Đơn vị tính A - Z" },
  { value: "unit_name_desc", label: "Đơn vị tính Z - A" },
  { value: "out_price_asc", label: "Giá bán Nhỏ - Lớn" },
  { value: "out_price_desc", label: "Giá bán Lớn - Nhỏ" },
  { value: "quantity_asc", label: "Tồn kho Nhỏ - Lớn" },
  { value: "quantity_desc", label: "Tồn kho Lớn - Nhỏ" },
];

export const sortWarehousingStatistic: ISortItem[] = [
  { value: "", label: "Mặc định" },
  { value: "created_at_asc", label: "Ngày nhập hàng cũ nhất" },
  { value: "created_at_desc", label: "Ngày nhập hàng mới nhất" },
  { value: "receipt_date_asc", label: "Ngày hóa đơn Cũ nhất - Mới nhất" },
  { value: "receipt_date_desc", label: "Ngày hóa đơn Mới nhất - Cũ nhất" },
  { value: "invoice_code_asc", label: "Mã hóa đơn A - Z" },
  { value: "invoice_code_desc", label: "Mã hóa đơn Z - A" },
  { value: "supplier_name_asc", label: "Nhà cung cấp A - Z" },
  { value: "supplier_name_desc", label: "Nhà cung cấp Z - A" },
  { value: "amount_asc", label: "Tổng tiền hàng trước thuế Nhỏ - Lớn" },
  { value: "amount_desc", label: "Tổng tiền hàng trước thuế Lớn - Nhỏ" },
  { value: "vat_asc", label: "VAT Nhỏ - Lớn" },
  { value: "vat_desc", label: "VAT Lớn - Nhỏ" },
  { value: "discount_asc", label: "Giảm giá Nhỏ - Lớn" },
  { value: "discount_desc", label: "Giảm giá Lớn - Nhỏ" },
  { value: "total_amount_asc", label: "Tổng tiền hàng sau VAT Nhỏ - Lớn" },
  { value: "total_amount_desc", label: "Tổng tiền hàng sau VAT Lớn - Nhỏ" },
  { value: "return_amount_asc", label: "Tiền trả hàng NCC Nhỏ - Lớn" },
  { value: "return_amount_desc", label: "Tiền trả hàng NCC Lớn - Nhỏ" },
  { value: "pay_amount_asc", label: "Thực trả Nhỏ - Lớn" },
  { value: "pay_amount_desc", label: "Thực trả Lớn - Nhỏ" },
  { value: "debt_amount_asc", label: "Công nợ Nhỏ - Lớn" },
  { value: "debt_amount_desc", label: "Công nợ Lớn - Nhỏ" },
];