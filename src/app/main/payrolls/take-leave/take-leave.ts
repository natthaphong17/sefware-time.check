import {setTimeout} from 'timers';

export class TakeLeave {
  code?: string = 'N/A';
  employee_code?: string | null | undefined;
  name?: string | null | undefined;
  sick_leave_start?: any = new Date();
  sick_leave_stop?: any = new Date();
  sick_leave_result?: string | null | undefined;

  constructor(params: TakeLeave) {
    Object.assign(this, params);
  }
}
