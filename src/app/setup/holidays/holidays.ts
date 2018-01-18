export class Holidays {
  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  date?: string | null | undefined;
  disable?: boolean = false;
  disableSelect?: boolean = true;

  constructor(params: Holidays) {
    Object.assign(this, params);
  }
}