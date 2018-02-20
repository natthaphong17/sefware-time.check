import { Component, OnInit } from '@angular/core';
import {SettingNetworkLocal} from './setting-network-local';
import {Language} from 'angular-l10n';
import {WorkingtimesettingTypeService} from './setting-network-local.service';
import * as _ from 'lodash';
import {TdLoadingService} from '@covalent/core';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import { version as appVersion } from '../../../../package.json';
import {MatDialog, MatSnackBar} from '@angular/material';
import {EmployeeType} from '../employee/employee-type';
import * as firebase from 'firebase';
import {AuthService} from '../../login/auth.service';
import {EmployeeTypeService} from '../employee/employee-type.service';

@Component({
  selector: 'app-setting-network-local',
  templateUrl: './setting-network-local.component.html',
  styleUrls: ['./setting-network-local.component.scss'],
  providers: [WorkingtimesettingTypeService, AuthService, EmployeeTypeService]
})
export class SettingNetworkLocalComponent implements OnInit {
  @Language() lang: string;

  data: SettingNetworkLocal = new SettingNetworkLocal({} as SettingNetworkLocal);
  loading: boolean = true;
  public appVersion;
  user: firebase.User;

  error: any;
  company_code = '';
  temp = [];

  constructor(private _settingNetworkLocal: WorkingtimesettingTypeService,
              private _loadingService: TdLoadingService,
              public snackBar: MatSnackBar,
              private _employeeService: EmployeeTypeService,
              public _authService: AuthService,
              private dialog: MatDialog) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });

    this.appVersion = appVersion;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _data = new EmployeeType(snapshot[0]);
      this.loading = true;
      this._settingNetworkLocal.requestDataByCode(_data.company_code).subscribe((snapshotB) => {

        const _row = new SettingNetworkLocal(snapshotB);
        this.data = _row;
      });
      this.loading = false;
    });
  }

  changeLocal(form) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'edit',
        title: 'Edit Setting Network Local',
        content: 'Confirm to Edit?',
        data_title: 'Setting Network Local',
        data: form.value.code + ' : ' + form.value.local
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this.data.local = form.value.local ? form.value.local : null;
        this._settingNetworkLocal.updateData(this.data).then(() => {
          this.snackBar.open('Edit Setting Network Local to' + form.local + ' ' , '', {duration: 3000});
        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }
}
