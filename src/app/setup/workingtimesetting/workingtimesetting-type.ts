export class WorkingTimeSettingType {
  code?: string = 'N/A';
  // image? = '../../../../../assets/images/placeholder.png';
  check_in?: string | null | undefined;
  check_out?: string | null | undefined;
  late?: string | null | undefined;
  policy?: string | null | undefined;

  constructor(params: WorkingTimeSettingType) {
    Object.assign(this, params);
  }
}
