import { Component, OnInit } from '@angular/core';
import {Language} from 'angular-l10n';
import * as _ from 'lodash';
import {TdLoadingService} from '@covalent/core';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SetCompanyProfile} from './set-company-profile';
import {SetCompanyProfileService} from './set-company-profile.service';

@Component({
  selector: 'app-set-company-profile',
  templateUrl: '../set-company-profile/set-company-profile.component.html',
  styleUrls: ['../set-company-profile/set-company-profile.component.scss'],
  providers: [SetCompanyProfileService]
})
export class SetCompanyProfileComponent implements OnInit {
  @Language() lang: string;

  data: SetCompanyProfile = new SetCompanyProfile({});
  loading: boolean = true;

  error: any;

  temp = [];

  constructor(private _setcompanyprofile: SetCompanyProfileService,
              private _loadingService: TdLoadingService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this._setcompanyprofile.requestDataByCode('1').subscribe((snapshot) => {

      const _row = new SetCompanyProfile(snapshot);
      this.data = _row;
    });
    this.loading = false;
  }

  changeLocal(form) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'edit',
        title: 'Edit Set Company Profile',
        content: 'Confirm to Edit?',
        data_title: 'Set Company Profile',
        data: form.value.code + ' : ' + form.value.company
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this.data.company = form.value.company ? form.value.company : null;
        this._setcompanyprofile.updateData(this.data).then(() => {
          this.snackBar.open('Edit Set Company Profile Complete', '', {duration: 3000});
        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }
}
