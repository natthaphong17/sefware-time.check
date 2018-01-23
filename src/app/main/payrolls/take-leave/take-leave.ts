import {setTimeout} from 'timers';
import {formArrayNameProvider} from '@angular/forms/src/directives/reactive_directives/form_group_name';

export class TakeLeave {
  code?: string = 'N/A';
  employee_code?: string | null | undefined;
  name?: string | null | undefined;
  start_leave?: any = new Date();
  end_leave?: any = new Date();
  take_leave?: string = 'Select';
  take_leave_status?: string = 'Waiting';

  constructor(params: TakeLeave) {
    Object.assign(this, params);
  }
}
