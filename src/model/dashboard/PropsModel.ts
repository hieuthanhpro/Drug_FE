export interface DasboardBlockProps {
  classNames?: string;
}

export interface ReportDashboardProps {
  classNames?: string;
  data: any[];
  handleFilterDate: (type: string, state: any) => any;
}