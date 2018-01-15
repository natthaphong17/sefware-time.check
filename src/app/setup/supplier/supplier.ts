export class Supplier {
  code?: string = 'N/A';
  supplier_type?: string | null | undefined;
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  address?: string | null | undefined;
  phone?: string | null | undefined;
  fax?: string | null | undefined;
  email?: string | null | undefined;
  term?: string | null | undefined;
  bank?: string | null | undefined;
  disable?: boolean = false;
  disableSelect?: boolean = true;

  constructor(params: Supplier) {
    Object.assign(this, params);
  }
}
