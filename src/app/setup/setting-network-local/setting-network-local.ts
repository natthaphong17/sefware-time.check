export class SettingNetworkLocal {
  code?: string = 'N/A';
  local?: string | null | undefined;
  company_code: string | null | undefined;

  constructor(params: SettingNetworkLocal) {
    Object.assign(this, params);
  }
}
