export class License {
  code?: string = 'N/A';
  license?: string | null | undefined;
  active_status?: string = 'no active';
  company_code?: string | null | undefined;
  time_start?: any = new Date();
  time_end?: any = new Date();
  time_length?: string | null | undefined;

  constructor(params: License) {
  Object.assign(this, params);
}
}
