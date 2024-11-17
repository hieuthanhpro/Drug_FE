export interface IDrugStore {
  id: number;
  name: string;
  warning_date: string;
  status: string;
  type: string;
  address?: string;
  phone?: string;
  settings?: {
    invoice_print_header?: string;
    invoice_print_footer?: string;
  }
}
