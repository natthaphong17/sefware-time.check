export class WorkingTimeSettingType {
  code?: string = 'N/A';
  // image? = '../../../../../assets/images/placeholder.png';
  checkin?: string | null | undefined;
  checkout?: string | null | undefined;
  late?: string | null | undefined;
  policy?: string | null | undefined;

  constructor(params: WorkingTimeSettingType) {
    Object.assign(this, params);
  }
}
