export class TakeLeave {
  code?: string = 'N/A';
  employee_code?: string | null | undefined;
  name?: string | null | undefined;
  disable?: boolean = false;

  constructor(params: TakeLeave) {
    Object.assign(this, params);
  }
}
