export interface IReportRevenue {
    amount: string;
    cash_amount: string;
    receipt_date: string;
    debt: string;
    direct_amount: string;
    discount: string;
    drug_code: number;
    not_cash_amount: string;
    not_direct_amount : string;
    sumamount: string;
    total: string;
    vat_amount: string;
}


export interface IReportRevenueProfit {
    cost: string;
    current_cost: string;
    discount: string;
    drug_code: string;
    drug_id: string;
    drug_name: string;
    expiry_date: number;
    number: string;
    org_cost : string;
    profit: string;
    profit_rate: string;
    return_cost?: string;
    return_quantity: number;
    revenue: string;
    sell_quantity : string;
    unit_id: string;
    unit_name: string;
    warehouse_current_cost: string;
    pre_cost: string;
}

export interface IReportWarehouseSell {
    amount: string;
    cost: string;
    created_at: string;
    customer_name: string;
    discount: string;
    drug_code: string;
    drug_name: string;
    expiry_date: string;
    invoice_code : string;
    number: string;
    number_phone?: string;
    quantity: number;
    return_quantity: number;
    supplier_invoice_code?: number;
    unit_id: number;
    unit_name: string;
    vat?: number
}

export interface IReportSalePerson {
    amount: string;
    cost: string;
    created_at: string;
    customer_name: string;
    drug_code: string;
    drug_name: string;
    expiry_date: string;
    invoice_code : string;
    invoice_id: string;
    number: string;
    number_phone?: string;
    quantity: number;
    return_quantity: number;
    sale_name: string;
    unit_id: number;
    unit_name: string;
    is_monopoly: boolean;
}

