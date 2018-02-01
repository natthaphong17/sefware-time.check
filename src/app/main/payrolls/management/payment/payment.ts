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
  personal_income_tex?: string | null | undefined;
  bonus_allowance?: string | null | undefined;
  social_security_monthly1?: string | null | undefined;
  social_security_monthly2?: string | null | undefined;
  incentive?: string | null | undefined;
  take_leave_no_pay?: string | null | undefined;
  meal_deduction?: string | null | undefined;
  ytd_income?: string | null | undefined;
  ytd_provident_fund?: string | null | undefined;
  ytd_tax?: string | null | undefined;
  ytd_social_security?: string | null | undefined;
  total_income?: string = '0.00';
  total_deduction?: string = '0.00';
  pay_status?: string = 'wait';

  constructor(params: Payment) {
    Object.assign(this, params);
  }
}
