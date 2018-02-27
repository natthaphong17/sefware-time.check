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
import { Location } from '@angular/common';

// Import Settings Dialog Component
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
import {ManagementCompanysComponent} from '../setup/management-companys/management-companys.component';
import {AddEmployeeAdminComponent} from '../setup/employee/add-employee-admin/add-employee-admin.component';
import {SetCompanyProfile} from '../setup/set-company-profile/set-company-profile';
import {SetCompanyProfileService} from '../setup/set-company-profile/set-company-profile.service';
import {CheckLicenseComponent} from './check-license/check-license.component';
import {LicenseComponent} from '../setup/license/license.component';
import {License} from '../setup/license/license';
import {LicenseService} from '../setup/license/license.service';
import {count} from '@angular/cli/node_modules/rxjs/operators';
import {EmployeeAdminComponent} from '../setup/employee-admin/employee-admin.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [EmployeeTypeService, SetCompanyProfileService, LicenseService]
})

export class MainComponent implements OnInit, AfterViewInit {

  @Language() lang: string;
  public appVersion;
  user: firebase.User;

  status = false;
  adminstatus = false;
  adminSefStatus = false;
  company_name = '';
  day: any;
  hour: any;
  warning = false;

  routes: object[] = [];

  constructor(
    private  _setcompanyprofile: SetCompanyProfileService,
    private  _setLicenseService: LicenseService,
    public _media: TdMediaService,
    public _authService: AuthService,
    private dialog: MatDialog,
    public router: Router,
    private location: Location,
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
    this.checkLicense();
    this.setRoutes();
  }

  setRoutes() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      if (snapshot[0].level === '1' || snapshot[0].level === '2') {
        this.routes = [{
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
        }];
      } else {
        this.routes = [{
          title: 'Home',
          route: '/main',
          icon: 'home',
        }, {
          title: 'Payrolls',
          route: '/main/payrolls/take-leave',
          icon: 'supervisor_account',
        }];
      }
    });
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

  openManagementCompanys() {
    const dialogRef = this.dialog.open(ManagementCompanysComponent, {
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

  openManagementLicense() {
    const dialogRef = this.dialog.open(LicenseComponent, {
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

  addEmployeeAdmin() {
    const dialogRef = this.dialog.open(EmployeeAdminComponent, {
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
      if (_row.level === '2' || _row.level === '1' || _row.level === '0') {
        this.status = true;
        if (_row.level === '0') {
          this.adminSefStatus = true;
        } else {
          this.adminstatus = true;
        }
      } else {
        this.status = false;
        this.adminSefStatus = false;
      }
    });
  }

  checkLicense() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _data = new EmployeeType(snapshot[0]);
      this._setcompanyprofile.requestDataByCode(_data.company_code).subscribe((snapshotB) => {
        const _row = new SetCompanyProfile(snapshotB);
        this.company_name = _row.company_name1;
        if (_data.level === '0') {
          // Pass
        } else {
          if (_row.license === 'non' || _row.license === 'time out') {
            this.dialog.open(CheckLicenseComponent, {
              disableClose: true,
              data: {
                type: 'active',
                title: 'You Company No Active !',
                content: 'Active Code',
                data_title: 'Please Active Code',
                user_active: '',
                company: _row.code,
                data_active: _row.license,
                data: _row.company_name1
              }
            });
            console.log(_row.license);
          } else {
            this._setLicenseService.requestDataByLicense(_row.license).subscribe((snapshotC) => {
              const _company = new License(snapshotC[0]);
              if (_company.time_end === 'Non Stop') {
              } else {
                // Set the date we're counting down to
                const countDownDate = new Date(_company.time_end).getTime();
                // Get todays date and time
                const start = new Date().getTime();
                // Find the distance between now an the count down date
                const distance = countDownDate - start;
                // Time calculations for days, hours, minutes and seconds
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                const countdowstime = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
                if (_data.level === '1' || _data.level === '2') {
                  if (days < 60) {
                    this.warning = true;
                    this.day = days;
                    this.hour = hours;
                    if (days < 0 && hours < 0 && minutes < 0) {
                      const data_company = {code : _data.company_code ,
                        license : 'time out'};
                      this._setcompanyprofile.updateData(data_company);
                      console.log('Show Time : ' + countdowstime);
                      this.warning = true;
                      this.refreshPage();
                    } else {
                      console.log('Show Time : ' + countdowstime);
                    }
                  }
                }
              }
            });
          }
        }
      });
    });
  }

  refreshPage() {
    location.reload();
  }
}
