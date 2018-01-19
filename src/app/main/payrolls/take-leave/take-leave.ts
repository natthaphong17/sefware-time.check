export class TakeLeave {
  code?: string = 'N/A';
  name?: string | null | undefined;
  disable?: boolean = false;

  constructor(params: TakeLeave) {
    Object.assign(this, params);
  }
}
