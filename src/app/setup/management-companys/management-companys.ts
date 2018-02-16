export class ManagementCompanys {
  code?: string = 'N/A';
  license?: string | null | undefined;
  active_status? = 'no active';
  company_name1?: string | null | undefined;
  company_name2?: string | null | undefined;

  constructor(params: ManagementCompanys) {
    Object.assign(this, params);
  }
}
