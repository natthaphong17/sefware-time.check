export class Department {
  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  disable?: boolean = false;
  disableSelect?: boolean = true;

  constructor(params: Department) {
    Object.assign(this, params);
  }
}
