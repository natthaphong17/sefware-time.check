
export class Logs {
  datetime?: number = new Date().getTime();
  ref?: string | null | undefined;
  path?: string | null | undefined;
  operation?: string | null | undefined;
  description?: string | null | undefined;
  user?: string | null | undefined;
  email?: string | null | undefined;
  photo?: string | null | undefined;
  old_data?: any | null | undefined;
  new_data?: any | null | undefined;

  constructor(params: Logs) {
    Object.assign(this, params);
  }
}

export class LogGroups {
  date?: string | null | undefined;
  logs_list?: Logs[]= [];

  constructor(params: LogGroups) {
    Object.assign(this, params);
  }
}
