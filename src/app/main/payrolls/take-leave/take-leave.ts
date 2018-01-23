import {setTimeout} from 'timers';
import {formArrayNameProvider} from '@angular/forms/src/directives/reactive_directives/form_group_name';

export class TakeLeave {
  code?: string = 'N/A';
  employee_code?: string | null | undefined;
  name?: string | null | undefined;
  sick_leave_start?: string | null | undefined;
  sick_leave_stop?: string | null | undefined;
  sick_leave_result?: string | null | undefined;

  constructor(params: TakeLeave) {
    Object.assign(this, params);
  }
}
