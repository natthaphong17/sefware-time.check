export class SetCompanyProfile {
  code?: string = 'N/A';
  company_name1?: string | null | undefined;
  company_name2?: string | null | undefined;
  branch?: string | null | undefined;
  branchno?: string | null | undefined;
  postal?: string | null | undefined;
  phone?: string | null | undefined;
  bank?: string | null | undefined;
  bank_account?: string | null | undefined;
  tax_number?: string | null | undefined;
  house_number?: string | null | undefined;
  village?: string | null | undefined;
  alley?: string | null | undefined;
  street?: string | null | undefined;
  district?: string | null | undefined;
  prefecture?: string | null | undefined;
  city?: string | null | undefined;
  license?: string | null | undefined;
  image? = '../../../../../assets/images/placeholder.png';

  constructor(params: SetCompanyProfile) {
    Object.assign(this, params);
  }
}
