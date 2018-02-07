export class SettingNetworkLocal {
  code?: string = 'N/A';
  local?: string | null | undefined;

  constructor(params: SettingNetworkLocal) {
    Object.assign(this, params);
  }
}
