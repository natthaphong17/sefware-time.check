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
  personal_income_tex?= 0;
  provident_fund?= 0;
  bonus_allowance? = 0;
  comission?= 0;
  social_security_monthly_emp? = 0;
  social_security_monthly? = 0;
  incentive? = 0;
  take_leave_no_pay? = 0;
  meal_deduction? = 0;
  ytd_income? = 0;
  ytd_provident_fund? = 0;
  ytd_tax? = 0;
  ytd_social_security? = 0;
  total_income? = 0;
  total_deduction? = 0;
  pay_status?: string | null | undefined;
  save_status?: string | null | undefined;
  emp_code?: string | null | undefined;

  constructor(params: Payment) {
    Object.assign(this, params);
  }
}
