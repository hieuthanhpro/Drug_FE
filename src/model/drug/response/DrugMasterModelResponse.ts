export interface IDrugMaster {
  id: number;
  name: string;
  drug_category_id?: number;
  drug_group_id?: number;
  unit_id: number;
  drug_code?: string;
  barcode?: string;
  short_name?: string;
  substances?: string;
  concentration?: string;
  country?: string;
  company?: string;
  registry_number?: string;
  package_form?: string;
  image?: string;
  description?: string;
  active?: "yes" | "no";
}
