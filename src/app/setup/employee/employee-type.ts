export class EmployeeType {
  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  disable?: boolean = false;
  disableSelect?: boolean = true;

  constructor(params: EmployeeType) {
    Object.assign(this, params);
  }
}
