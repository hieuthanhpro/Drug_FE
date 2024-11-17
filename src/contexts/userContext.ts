import React from "react";

export interface ContextType {
  id: number;
  username: string;
  name: string;
  email: string;
  status: "active" | "locked";
  token: string;
  drug_store: {
    id: number;
    name: string;
    warning_date: number;
    status: number;
    type: string;
    address: string;
  };
  role: string;
  permissions: string[];
  isCollapsedSidebar: boolean;
  setIsCollapsedSidebar: (e: boolean) => void;
}
export const UserContext = React.createContext({});
