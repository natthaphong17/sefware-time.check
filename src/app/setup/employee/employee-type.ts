export class EmployeeType {
  id?: string = 'N/A';
  image? = '../../../../../assets/images/placeholder.png';
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  position?: string | null | undefined;
  level?: string | null | undefined;
  holidays?: string | null | undefined;
  vacations?: string | null | undefined;
  // account?: string | null | undefined;
  address?: string | null | undefined;
  // bank?: string | null | undefined;
  // mobile?: string | null | undefined;
  nationalid?: string | null | undefined;
  // phon?: string | null | undefined;
  picture?: string | null | undefined;
  salary?: string | null | undefined;
  pin?: string | null | undefined;
  department?: string | null | undefined;
  disableSelect?: boolean = true;

  constructor(params: EmployeeType) {
    Object.assign(this, params);
  }
}
