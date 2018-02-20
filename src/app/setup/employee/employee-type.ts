export class EmployeeType {
  code?: string = 'N/A';
  image? = '../../../../../assets/images/placeholder.png';
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  position?: string | null | undefined;
  level?: string | null | undefined;
  holidays?: string | null | undefined;
  vacations?: string | null | undefined;
  account?: string | null | undefined;
  address?: string | null | undefined;
  bank?: string | null | undefined;
  mobile?: string | null | undefined;
  nationalid?: string | null | undefined;
  phon?: string | null | undefined;
  picture?: string | null | undefined;
  salary?: number = 0.00;
  pin?: string | null | undefined;
  department?: string | null | undefined;
  statusTime?: string | null | undefined;
  check_in?: string | null | undefined;
  check_out?: string | null | undefined;
  email: string | null | undefined;
  marry_status: string | null | undefined;
  company_code: string | null | undefined;
  resing: string | null | undefined;
  resing_date = new Date();
  work_start_date: string | null | undefined;
  late_work: string | null | undefined;
  // print report
  date_payment: string | null | undefined;
  total_payment: number = 0;
  total_deduction: number = 0;
  social_security_monthly_emp: number = 0;
  social_security_monthly: number = 0;

  constructor(params: EmployeeType) {
    Object.assign(this, params);
  }
}
