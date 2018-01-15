export class Item {
  code?: string = 'N/A';
  image? = '../../../../../assets/images/placeholder.png';
  type_code?: string | null | undefined;
  group_code?: string | null | undefined;
  subgroup_code?: string | null | undefined;
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  primary_unit?: string | null | undefined;
  primary_unit_name?: string | null | undefined;
  secondary_unit?: string | null | undefined;
  min?: number = 0;
  max?: number = 0;
  disable?: boolean = false;
  disableSelect?: boolean = true;

  constructor(params: Item) {
    Object.assign(this, params);
  }
}
