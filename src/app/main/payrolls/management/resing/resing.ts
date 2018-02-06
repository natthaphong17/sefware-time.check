import {setTimeout} from 'timers';
import {formArrayNameProvider} from '@angular/forms/src/directives/reactive_directives/form_group_name';

export class Resing {
  code?: string | null | undefined;
  resing?: string | null | undefined;

  constructor(params: Resing) {
    Object.assign(this, params);
  }
}
