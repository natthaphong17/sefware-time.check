export class ItemType {
  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  company_code?: string | null | undefined;
  disable?: boolean = false;
  disableSelect?: boolean = true;

  constructor(params: ItemType) {
    Object.assign(this, params);
  }
}
