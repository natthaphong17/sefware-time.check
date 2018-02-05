export class CheckInOutTime {
  code?: string | null | undefined;
  employee_code?: string | null | undefined;
  date?: string | null | undefined;

  constructor(params: CheckInOutTime) {
    Object.assign(this, params);
  }
}
