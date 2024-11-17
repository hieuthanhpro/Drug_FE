export interface ICustomerRequest {
  type: "personal" | "company";
  name: string;
  number_phone?: string;
  email?: string;
  gender: "male" | "fmale" | "company";
  birthday?: string;
  address?: string;
  tax_number?: string;
  website?: string;
}
