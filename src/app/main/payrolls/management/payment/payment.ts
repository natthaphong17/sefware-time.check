import {setTimeout} from 'timers';
import {formArrayNameProvider} from '@angular/forms/src/directives/reactive_directives/form_group_name';

export class Payment {
  payment_code?: string | null | undefined;
  payment_date?: number = new Date().getTime();
  code?: string = 'N/A';
  name1?: string | null | undefined;
  bank?: string | null | undefined;
  account?: string | null | undefined;
  salary?: string | null | undefined;
  period?: any = '';
  payday?: any = '';
  personal_income_tex?: number = 0;
  bonus_allowance?: number = 0;
  social_security_monthly_emp?: number = 0;
  social_security_monthly?: number = 0;
  incentive?: number = 0;
  take_leave_no_pay?: number = 0;
  meal_deduction?: number = 0;
  ytd_income?: number = 0;
  ytd_provident_fund?: number = 0;
  ytd_tax?: number = 0;
  ytd_social_security?: number = 0;
  total_income?: number = 0;
  total_deduction?: number = 0;
  pay_status?: string | null | undefined;
  save_status?: string | null | undefined;

  constructor(params: Payment) {
    Object.assign(this, params);
  }
}
