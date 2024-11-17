export interface ICustomer {
  id: number;
  name: string;
  number_phone?: string;
  email?: string;
  gender: "male" | "fmale" | "company";
  birthday?: string;
  company?: string;
  address?: string;
  tax_number?: string;
  status: boolean;
  website?: string;
  created_at: string;
  updated_at?: string;
}
