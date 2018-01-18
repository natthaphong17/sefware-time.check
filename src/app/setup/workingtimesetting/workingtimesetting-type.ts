export class WorkingTimeSettingType {
  id?: string = 'N/A';
  image? = '../../../../../assets/images/placeholder.png';
  checkin?: string | null | undefined;
  checkout?: string | null | undefined;
  code?: string | null | undefined;
  late?: string | null | undefined;
  policy?: string | null | undefined;
  disableSelect?: boolean = true;

  constructor(params: WorkingTimeSettingType) {
    Object.assign(this, params);
  }
}
