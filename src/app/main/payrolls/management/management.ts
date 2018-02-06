import {setTimeout} from 'timers';
import {formArrayNameProvider} from '@angular/forms/src/directives/reactive_directives/form_group_name';

export class Management {
  code?: string = 'N/A';
  name1?: string | null | undefined;
  sick_leave?: number = 0;
  bussiness_leave?: number = 0;
  holiday?: number = 0;
  vacation?: number = 0;
  resing: string = 'green';
  pay_status: string = 'wait';
  save_status: string = 'no';

  constructor(params: Management) {
    Object.assign(this, params);
  }
}

export class TakeLeave {
  code?: string = 'N/A';
  employee_code?: string = '1001';
  name1?: string | null | undefined;

  constructor(params: TakeLeave) {
    Object.assign(this, params);
  }
}
