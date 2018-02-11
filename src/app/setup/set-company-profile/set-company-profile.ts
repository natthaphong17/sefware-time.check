export class SetCompanyProfile {
  code?: string = 'N/A';
  company?: string | null | undefined;

  constructor(params: SetCompanyProfile) {
    Object.assign(this, params);
  }
}
