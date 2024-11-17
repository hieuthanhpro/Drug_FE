export interface IWarehouseInvoiceResponse {
  code: string;
  created_at: string;
  created_by?: number;
  date: string;
  id: number;
  quantity: number;
  reason: string;
  refcode?: string;
  status?: string;
  type?: string;
}

export interface IWarehouse {
  drug_code: string;
  drug_name: string;
  current_cost?: number;
  expiry_date: string;
  main_cost: number;
  quantity: number;
  number: string;
  package_form?: string;
  row_number: number;
  total_buy: number;
  total_sell: number;
  unit_id: number;
  unit_name: string;
}

