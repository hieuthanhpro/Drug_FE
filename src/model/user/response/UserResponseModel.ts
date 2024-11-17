export interface IUser {
  id: number;
  name?: string;
  username: string;
  full_name?: string;
  email?: string;
  avatar?: string;
  number_phone: string;
  active: "yes" | "no";
  remember_token: "yes" | "no";
  user_role: string;
  permission?: string;
  settings?: string;
  created_at: string;
  updated_at?: string;
}

export interface IUserLogin {
  id?: number;
  name: string;
  email?: string;
  username: string;
  password?: string;
  role?: string;
  status?: "active" | "locked";
  created_at: string;
  updated_at?: string;
  expired_cookie?: string;
}
