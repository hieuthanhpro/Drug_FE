export const eventType = {
  sale: "Bán hàng cho khách hàng",
  warehousing: "Nhập hàng từ nhà cung cấp",
  order: "Đặt hàng từ nhà cung cấp",
  customer_return: "Khách hàng trả hàng",
  return_supplier: "Trả hàng nhà cung cấp",
};

export const typeFilterSelling = [
  {
    value: "order",
    label: "Số lượng đơn hàng",
  },
  {
    value: "quantity",
    label: "Số lượng bán",
  },
  {
    value: "quantity_product",
    label: "Số sản phẩm bán",
  },
  {
    value: "amount",
    label: "Giá trị hàng bán",
  },
];