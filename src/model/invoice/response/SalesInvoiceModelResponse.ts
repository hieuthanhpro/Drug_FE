export interface ISalesItemModalResponse {
  id: number;
  image?: string;
  name: string;
  drug_code: string;
  drug_category_id?: number;
  drug_category_name?: string;
  drug_group_id?: number;
  drug_group_name?: string;
  package_form?: string;
  company?: string;
  country?: string;
  registry_number?: string;
  short_name?: string;
  number: string;
  unit_id: number;
  unit_name: string;
  current_cost: number;
  expiry_date: string;
  main_cost: number;
  quantity: number;
  units: string;
  numbers: string;
  other_units?: string;
}
