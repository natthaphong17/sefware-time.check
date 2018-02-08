import {setTimeout} from 'timers';
import {formArrayNameProvider} from '@angular/forms/src/directives/reactive_directives/form_group_name';

export class TakeLeave {
  code?: string = 'N/A';
  employee_code?: string | null | undefined;
  employee_name?: string | null | undefined;
  department?: string | null | undefined;
  start_leave?: any = '';
  end_leave?: any = '';
  take_leave?: string = 'Select';
  take_leave_status?: string = 'Waiting';
  status_colos?: string = '#FF9800';
  disable?: boolean = false;

  constructor(params: TakeLeave) {
    Object.assign(this, params);
  }
}
