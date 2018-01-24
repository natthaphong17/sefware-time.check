export class CheckTime {
  code?: string = 'N/A';
  date?: string | null | undefined;
  employee_code?: string | null | undefined;
  check_in_time?: string | null | undefined;
  check_in_result?: string | null | undefined;
  check_in_status?: string | null | undefined;
  check_out_time?: string | null | undefined;
  check_out_result?: string | null | undefined;
  check_out_status?: string | null | undefined;

  constructor(params: CheckTime) {
    Object.assign(this, params);
  }
}
