export class AdminTestPhoto {
  code?: string = 'N/A';
  local?: string | null | undefined;
  company_code: string | null | undefined;

  constructor(params: AdminTestPhoto) {
    Object.assign(this, params);
  }
}
