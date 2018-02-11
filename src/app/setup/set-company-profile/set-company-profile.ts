export class SetCompanyProfile {
  code?: string = 'N/A';
  company?: string | null | undefined;
  branch?: string | null | undefined;
  branchno?: string | null | undefined;
  address?: string | null | undefined;
  postal?: string | null | undefined;
  phone?: string | null | undefined;
  bank?: string | null | undefined;
  bank_account?: string | null | undefined;
  bank_tax?: string | null | undefined;
  bank_account_tax?: string | null | undefined;
  image? = '../../../../../assets/images/placeholder.png';

  constructor(params: SetCompanyProfile) {
    Object.assign(this, params);
  }
}
