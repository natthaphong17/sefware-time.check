export class Uom {
  code?: string = 'N/A';
  shortname?: string | null | undefined;
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  disable?: boolean = false;
  disableSelect?: boolean = true;

  constructor(params: Uom) {
    Object.assign(this, params);
  }
}
