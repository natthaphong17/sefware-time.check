import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Language, LocaleService} from 'angular-l10n';
import {AuthService} from '../login/auth.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {TdMediaService} from '@covalent/core';
import {ResetPasswordComponent} from '../dialog/reset-password/reset-password.component';
import {UploadImageComponent} from '../dialog/upload-image/upload-image.component';
import { LogsDialogComponent } from '../dialog/logs-dialog/logs-dialog.component';
import { version as appVersion } from '../../../package.json';
import * as firebase from 'firebase';

// Import Settings Dialog Component
import { ItemTypeComponent } from '../setup/item-type/item-type.component';
import { ItemGroupComponent } from '../setup/item-group/item-group.component';
import { ItemSubGroupComponent } from '../setup/item-sub-group/item-sub-group.component';
import { ItemComponent } from '../setup/item/item.component';
import { UomComponent } from '../setup/uom/uom.component';
import { SupplierComponent } from '../setup/supplier/supplier.component';
import { DepartmentComponent } from '../setup/department/department.component';
import { LocationComponent} from '../setup/location/location.component';
import { EmployeeComponent} from '../setup/employee/employee.component';
import {WorkingtimesettingComponent} from '../setup/workingtimesetting/workingtimesetting.component';
import {HolidaysComponent} from '../setup/holidays/holidays.component';
import {CheckTimeComponent} from '../setup/check-time/check-time.component';
import {SettingNetworkLocalComponent} from '../setup/setting-network-local/setting-network-local.component';
import {EmployeeTypeService} from '../setup/employee/employee-type.service';
import {CheckTime} from '../setup/check-time/check-time';
import {EmployeeType} from '../setup/employee/employee-type';
import {SetCompanyProfileComponent} from '../setup/set-company-profile/set-company-profile.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [EmployeeTypeService]
})

export class MainComponent implements OnInit, AfterViewInit {

  @Language() lang: string;
  public appVersion;
  user: firebase.User;

  status = false;

  routes: object[] = [{
    title: 'Home',
    route: '/main',
    icon: 'home',
  }, {
    title: 'Payrolls',
    route: '/main/payrolls/take-leave',
    icon: 'supervisor_account',
  }, {
    title: 'Report',
    route: '/main/report/pjd1',
    icon: 'find_in_page',
  },
  ];

  constructor(
    public _media: TdMediaService,
    public _authService: AuthService,
    private dialog: MatDialog,
    public router: Router,
    public locale: LocaleService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _employeeService: EmployeeTypeService
  ) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });

    this.appVersion = appVersion;
  }

  ngAfterViewInit(): void {
    this._media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.setEmployee();
  }

  selectLanguage(language: string): void {
    this.locale.setCurrentLanguage(language);
  }
  openHolidays() {
    const dialogRef = this.dialog.open(HolidaysComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  openCheckTime() {
    const dialogRef = this.dialog.open(CheckTimeComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  openEmployeeProfile() {
    const dialogRef = this.dialog.open(EmployeeComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  openItemTypeDialog() {
    const dialogRef = this.dialog.open(ItemTypeComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  openItemGroupDialog() {
    const dialogRef = this.dialog.open(ItemGroupComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  openItemSubGroupDialog() {
    const dialogRef = this.dialog.open(ItemSubGroupComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  openItemDialog() {
    const dialogRef = this.dialog.open(ItemComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  openDepartment() {
    const dialogRef = this.dialog.open(DepartmentComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  openWokingTimeSetting() {
    const dialogRef = this.dialog.open(WorkingtimesettingComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  logout() {
    this._authService.signout();
  }

  refresh() {
    location.reload();
  }

  resetPassword() {
    this.dialog.open(ResetPasswordComponent, {
      data: {
        type: 'reset_password',
        title: 'Reset password',
        content: 'Send a password reset email.',
        data_title: 'User account',
        data: this.user.email
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this._authService.resetPassword(this.user.email).then((_) => console.log('success'))
          .catch((err) => console.log(err, 'You do not have access!'));
      }
    });
  }

  openSetting() {

  }

  uploadProfile() {
    this.dialog.open(UploadImageComponent, {
      data: {
        title: 'Upload profile',
        link: this.user.photoURL,
        type: 'image/png',
        path: 'users_profile/' + this.user.uid + '.png'
      }
    }).afterClosed().subscribe((link: string) => {
      if (link) {
        this._authService.updateProfile(this.user.displayName, link).then((_) => console.log('success updateProfile'))
          .catch((err) => console.log(err, 'You do not have access!'));
      }
    });
  }

  settingNetworkLocal() {
    const dialogRef = this.dialog.open(SettingNetworkLocalComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  setCompanyProfile() {
    const dialogRef = this.dialog.open(SetCompanyProfileComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  setEmployee() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _row = new EmployeeType(snapshot[0]);
      if (_row.level === '1' || _row.level === '2') {
        this.status = true;
      } else {
        this.status = false;
      }
    });
  }
}
