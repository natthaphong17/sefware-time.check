export class Comparison {
  code?: string = 'N/A';
  name?: string | null | undefined;
  disable?: boolean = false;

  constructor(params: Comparison) {
    Object.assign(this, params);
  }
}
