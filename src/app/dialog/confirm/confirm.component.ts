import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Language} from 'angular-l10n';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class ConfirmComponent {
  @Language() lang: string;
  data: any;

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: any) {
    // console.log(md_data);
    this.data = md_data;
  }

}
