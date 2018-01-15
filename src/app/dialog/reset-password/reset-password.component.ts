import {Component, Inject} from '@angular/core';
import {Language} from 'angular-l10n';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {ConfirmComponent} from '../confirm/confirm.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent {
  @Language() lang: string;

  data: any;

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: any) {
    console.log(md_data);
    this.data = md_data;

  }
}
