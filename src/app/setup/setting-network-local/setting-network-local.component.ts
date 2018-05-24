import {Component, Inject, OnInit} from '@angular/core';
import {SettingNetworkLocal} from './setting-network-local';
import {Language} from 'angular-l10n';
import {SettingNetworkLocalService} from './setting-network-local.service';
import * as _ from 'lodash';
import {TdLoadingService} from '@covalent/core';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import { version as appVersion } from '../../../../package.json';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {EmployeeType} from '../employee/employee-type';
import * as firebase from 'firebase';
import {AuthService} from '../../login/auth.service';
import {EmployeeTypeService} from '../employee/employee-type.service';
import {count} from '@angular/cli/node_modules/rxjs/operators';
import {WorkingTimeSettingType} from '../workingtimesetting/workingtimesetting-type';

@Component({
  selector: 'app-setting-network-local',
  templateUrl: './setting-network-local.component.html',
  styleUrls: ['./setting-network-local.component.scss'],
  providers: [AuthService, EmployeeTypeService, SettingNetworkLocalService]
})
export class SettingNetworkLocalComponent implements OnInit {
  @Language() lang: string;

  data: SettingNetworkLocal = new SettingNetworkLocal({} as SettingNetworkLocal);
  loading: boolean = true;
  company_check = '';
  public appVersion;
  user: firebase.User;

  error: any;
  company_code = '';
  temp = [];

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: SettingNetworkLocal,
              private _settingNetworkLocal: SettingNetworkLocalService,
              private _loadingService: TdLoadingService,
              public snackBar: MatSnackBar,
              private _employeeService: EmployeeTypeService,
              public _authService: AuthService,
              private dialog: MatDialog) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;
    try {
      if (md_data) {
        this.data = new SettingNetworkLocal(md_data);

      } else {
        this._settingNetworkLocal.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit() {
    this.setEmployee();
  }

  load() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _data = new EmployeeType(snapshot[0]);
      this.loading = true;
      console.log('See Conpany Code : ' + _data.company_code);
      this._settingNetworkLocal.requestData().subscribe((snapshotB) => {
        snapshotB.forEach((s) => {
          const _row = new SettingNetworkLocal(s.val());
          if (s.val().company_code === _data.company_code) {
            console.log('See Row : ' + JSON.stringify(_row));
            this.data = _row;
          }
        });
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

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      this.data.local = form.value.local ? form.value.local : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
        } else {
          this._settingNetworkLocal.updateData(this.data).then(() => {
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._settingNetworkLocal.addData(this.data).then(() => {
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }

  generateCode() {
    this._loadingService.register('data.form');
    // const prefix = 'TYPE';
    // this.data.code = prefix + '-001';
    this.data.code = '1';
    this._settingNetworkLocal.requestLastData().subscribe((s) => {
      s.forEach((ss: WorkingTimeSettingType) => {
        console.log('Prev Code aa:' + ss.code );
        // tslint:disable-next-line:radix
        const str = parseInt(ss.code.substring(ss.code.length - 1, ss.code.length)) + 1;
        const last = '' + str;

        /*let last = prefix + '-' + str;

        if (str < 100) {
          last = prefix + '-0' + str;
        }

        if (str < 10) {
          last = prefix + '-00' + str;
        }*/

        this.data.code = last;
      });
      this._loadingService.resolve('data.form');
    });
  }

  setEmployee() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _employeedata = new EmployeeType(snapshot[0]);
      this.company_check = _employeedata.company_code;
      this.data.company_code = _employeedata.company_code;
      this.load();
    });
  }
}
