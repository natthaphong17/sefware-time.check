import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Language, LocaleService} from 'angular-l10n';
import {AuthService} from '../login/auth.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {TdMediaService} from '@covalent/core';
import {ResetPasswordComponent} from '../dialog/reset-password/reset-password.component';
import {UploadImageComponent} from '../dialog/upload-image/upload-image.component';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Language, LocaleService } from 'angular-l10n';
import { AuthService } from '../login/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TdMediaService } from '@covalent/core';
import { ResetPasswordComponent } from '../dialog/reset-password/reset-password.component';
import { UploadImageComponent } from '../dialog/upload-image/upload-image.component';
import { LogsDialogComponent } from '../dialog/logs-dialog/logs-dialog.component';
import { version as appVersion } from '../../../package.json';
import * as firebase from 'firebase';
import { Location } from '@angular/common';

// Import Settings Dialog Component
import { UomComponent } from '../setup/uom/uom.component';
import { SupplierComponent } from '../setup/supplier/supplier.component';
import { DepartmentComponent } from '../setup/department/department.component';
import { LocationComponent } from '../setup/location/location.component';
import { EmployeeComponent } from '../setup/employee/employee.component';
import { WorkingtimesettingComponent } from '../setup/workingtimesetting/workingtimesetting.component';
import { HolidaysComponent } from '../setup/holidays/holidays.component';
import { CheckTimeComponent } from '../setup/check-time/check-time.component';
import { SettingNetworkLocalComponent } from '../setup/setting-network-local/setting-network-local.component';
import { EmployeeTypeService } from '../setup/employee/employee-type.service';
import { CheckTime } from '../setup/check-time/check-time';
import { EmployeeType } from '../setup/employee/employee-type';
import { SetCompanyProfileComponent } from '../setup/set-company-profile/set-company-profile.component';
import { ManagementCompanysComponent } from '../setup/management-companys/management-companys.component';
import { AddEmployeeAdminComponent } from '../setup/employee/add-employee-admin/add-employee-admin.component';
import { SetCompanyProfile } from '../setup/set-company-profile/set-company-profile';
import { SetCompanyProfileService } from '../setup/set-company-profile/set-company-profile.service';
import { CheckLicenseComponent } from './check-license/check-license.component';
import { LicenseComponent } from '../setup/license/license.component';
import { License } from '../setup/license/license';
import { LicenseService } from '../setup/license/license.service';
import { count } from '@angular/cli/node_modules/rxjs/operators';
import { EmployeeAdminComponent } from '../setup/employee-admin/employee-admin.component';
import { AdminTestPhotoComponent } from '../setup/admin-Test-Photo/admin-test-photo.component';
import { SettingPhotoComponent } from '../setup/setting-photo/setting-photo.component';
import { SettingPhotoService } from '../setup/setting-photo/setting-photo.service';
import { UploadService } from '../services/upload.service';
import { LocationComponent} from '../setup/location/location.component';
import { EmployeeComponent} from '../setup/employee/employee.component';
import {WorkingtimesettingComponent} from '../setup/workingtimesetting/workingtimesetting.component';
import {HolidaysComponent} from '../setup/holidays/holidays.component';
import {CheckTimeComponent} from '../setup/check-time/check-time.component';
import {SettingNetworkLocalComponent} from '../setup/setting-network-local/setting-network-local.component';
import {EmployeeTypeService} from '../setup/employee/employee-type.service';
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
import {EmployeeAdminComponent} from '../setup/employee-admin/employee-admin.component';
import { ImageCheckInComponent } from '../setup/image-check-in/image-check-in.component';
import {CheckInOut} from '../setup/check-time/check-in-out';
import {WorkingtimesettingTypeService} from '../setup/workingtimesetting/workingtimesetting-type.service';
import {CheckTimeService} from '../setup/check-time/check-time.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [EmployeeTypeService, SetCompanyProfileService, LicenseService, SettingPhotoService, UploadService]
  providers: [EmployeeTypeService, SetCompanyProfileService, LicenseService, CheckInOut, WorkingtimesettingTypeService, CheckTimeService]
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

  noImg = '../../../assets/images/user.jpg';

  constructor(
    private _setcompanyprofile: SetCompanyProfileService,
    private _setLicenseService: LicenseService,
    public _media: TdMediaService,
    public _authService: AuthService,
    private dialog: MatDialog,
    public router: Router,
    private location: Location,
    public locale: LocaleService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _employeeService: EmployeeTypeService,
    private _settingPhotoService: SettingPhotoService,
    private _uploadService: UploadService
    private _employeeService: EmployeeTypeService,
    private _checkInOut: CheckInOut
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
    this.checkDeletePhotoAutoMode();
    this._checkInOut.load();
    this._checkInOut.autoCheckOut();
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

  openImageCheckTime() {
    const dialogRef = this.dialog.open(ImageCheckInComponent, {
      maxWidth: '100vw',
      width: '100%',
      height: '100%'
    });
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

  settingPhoto() {
    const dialogRef = this.dialog.open(SettingPhotoComponent, {
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

  adminTestPhoto() {
    const dialogRef = this.dialog.open(AdminTestPhotoComponent, {
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
                      const data_company = {
                        code: _data.company_code,
                        license: 'time out'
                      };
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

  checkDeletePhotoAutoMode() {
    this._settingPhotoService.requestDateByAutoModeCode('1').subscribe((mode) => {
      if (mode.length === 1 && mode[0].auto_mode === true) {
        const d = new Date().getDate();
        const m = new Date().getMonth() + 1;
        const y = new Date().getFullYear();
        mode.map((data) => {
          const _d = new Date(data.time_start).getDate() - 1;
          const _m = new Date(data.time_start).getMonth() + 1;
          const _y = new Date(data.time_start).getFullYear();
          if (data.select_mode === '4') {
            if (y === _y) {
              if (m === _m) {
                if (_y > 15) {
                  let _mm = '' + _m;
                  let mm = '' + m;
                  if (_m < 10) {
                    _mm = '0' + _m;
                  }
                  if (m < 10) {
                    mm = '0' + m;
                  }
                  const start = _y + '-' + _mm + '-' + '00';
                  const end = y + '-' + mm + '-' + '15';
                  this._settingPhotoService.requestDataByCodeDate(start, end).subscribe((listData) => {
                    listData.map((_data) => {
                      if (_data.photo_path === 'Delete') {
                        _data.check_in_photo = this.noImg;
                        this._settingPhotoService.updateData(_data);
                      } else {
                        if (_data.photo_path === undefined) {
                          _data.check_in_photo = this.noImg;
                          _data.photo_path = 'Delete';
                          this._settingPhotoService.updateData(_data);
                        } else {
                          this._uploadService.deleteFile(_data.photo_path);
                          _data.check_in_photo = this.noImg;
                          _data.photo_path = 'Delete';
                          this._settingPhotoService.updateData(_data);
                        }
                      }
                    });
                  });
                } else {
                  console.log('This Day < 15');
                }
              } else {
                let _mm = '' + _m;
                let mm = '' + m;
                if (_m < 10) {
                  _mm = '0' + _m;
                }
                if (m < 10) {
                  mm = '0' + m;
                }
                const start = _y + '-' + _mm + '-' + '15';
                const end = _y + '-' + _mm + '-' + '32';
                this._settingPhotoService.requestDataByCodeDate(start, end).subscribe((listData) => {
                  listData.map((_data) => {
                    if (_data.photo_path === 'Delete') {
                      _data.check_in_photo = this.noImg;
                      this._settingPhotoService.updateData(_data);
                      const sumMonth = new Date(y + '/' + m + '/' + _d);
                      data.time_start = sumMonth;
                      this._settingPhotoService.addDataAutoMode(data);
                    } else {
                      if (_data.photo_path === undefined) {
                        _data.check_in_photo = this.noImg;
                        _data.photo_path = 'Delete';
                        this._settingPhotoService.updateData(_data);
                        const sumMonth = new Date(y + '/' + m + '/' + _d);
                        data.time_start = sumMonth;
                        this._settingPhotoService.addDataAutoMode(data);
                      } else {
                        this._uploadService.deleteFile(_data.photo_path);
                        _data.check_in_photo = this.noImg;
                        _data.photo_path = 'Delete';
                        this._settingPhotoService.updateData(_data);
                        const sumMonth = new Date(y + '/' + m + '/' + _d);
                        data.time_start = sumMonth;
                        this._settingPhotoService.addDataAutoMode(data);
                      }
                    }
                  });
                });
              }
            } else {
              if (_y < 15) {
                let _mm = '' + _m;
                let mm = '' + m;
                if (_m < 10) {
                  _mm = '0' + _m;
                }
                if (m < 10) {
                  mm = '0' + m;
                }
                const start = _y + '-' + _mm + '-' + '00';
                const end = _y + '-' + _mm + '-' + '15';
                this._settingPhotoService.requestDataByCodeDate(start, end).subscribe((listData) => {
                  listData.map((_data) => {
                    if (_data.photo_path === 'Delete') {
                      _data.check_in_photo = this.noImg;
                      this._settingPhotoService.updateData(_data);
                      const sumMonth = new Date(y + '/' + m + '/' + _d);
                      data.time_start = sumMonth;
                      this._settingPhotoService.addDataAutoMode(data);
                    } else {
                      if (_data.photo_path === undefined) {
                        _data.check_in_photo = this.noImg;
                        _data.photo_path = 'Delete';
                        this._settingPhotoService.updateData(_data);
                        const sumMonth = new Date(y + '/' + m + '/' + _d);
                        data.time_start = sumMonth;
                        this._settingPhotoService.addDataAutoMode(data);
                      } else {
                        this._uploadService.deleteFile(_data.photo_path);
                        _data.check_in_photo = this.noImg;
                        _data.photo_path = 'Delete';
                        this._settingPhotoService.updateData(_data);
                        const sumMonth = new Date(y + '/' + m + '/' + _d);
                        data.time_start = sumMonth;
                        this._settingPhotoService.addDataAutoMode(data);
                      }
                    }
                  });
                });
              } else {
                let _mm = '' + _m;
                let mm = '' + m;
                if (_m < 10) {
                  _mm = '0' + _m;
                }
                if (m < 10) {
                  mm = '0' + m;
                }
                const start = _y + '-' + _mm + '-' + '15';
                const end = _y + '-' + _mm + '-' + '32';
                this._settingPhotoService.requestDataByCodeDate(start, end).subscribe((listData) => {
                  listData.map((_data) => {
                    if (_data.photo_path === 'Delete') {
                      _data.check_in_photo = this.noImg;
                      this._settingPhotoService.updateData(_data);
                      const sumMonth = new Date(y + '/' + m + '/' + _d);
                      data.time_start = sumMonth;
                      this._settingPhotoService.addDataAutoMode(data);
                    } else {
                      if (_data.photo_path === undefined) {
                        _data.check_in_photo = this.noImg;
                        _data.photo_path = 'Delete';
                        this._settingPhotoService.updateData(_data);
                        const sumMonth = new Date(y + '/' + m + '/' + _d);
                        data.time_start = sumMonth;
                        this._settingPhotoService.addDataAutoMode(data);
                      } else {
                        this._uploadService.deleteFile(_data.photo_path);
                        _data.check_in_photo = this.noImg;
                        _data.photo_path = 'Delete';
                        this._settingPhotoService.updateData(_data);
                        const sumMonth = new Date(y + '/' + m + '/' + _d);
                        data.time_start = sumMonth;
                        this._settingPhotoService.addDataAutoMode(data);
                      }
                    }
                  });
                });
              }
            }
          } else {
            // ELSE : MODE != 4
            if (y === _y) {
              if (m - _m === data.select_mode) {
                let _mm = '' + _m;
                let mm = '' + m;
                if (_m < 10) {
                  _mm = '0' + _m;
                }
                const i = m - 1;
                if (i < 10) {
                  mm = '0' + i;
                }
                const start = _y + '-' + _mm + '-' + '00';
                const end = y + '-' + mm + '-' + '32';
                this._settingPhotoService.requestDataByCodeDate(start, end).subscribe((listData) => {
                  listData.map((_data) => {
                    if (_data.photo_path === 'Delete') {
                      _data.check_in_photo = this.noImg;
                      this._settingPhotoService.updateData(_data);
                      const sumMonth = new Date(y + '/' + m + '/' + _d);
                      data.time_start = sumMonth;
                      this._settingPhotoService.addDataAutoMode(data);
                    } else {
                      if (_data.photo_path === undefined) {
                        _data.check_in_photo = this.noImg;
                        _data.photo_path = 'Delete';
                        this._settingPhotoService.updateData(_data);
                        const sumMonth = new Date(y + '/' + m + '/' + _d);
                        data.time_start = sumMonth;
                        this._settingPhotoService.addDataAutoMode(data);
                      } else {
                        this._uploadService.deleteFile(_data.photo_path);
                        _data.check_in_photo = this.noImg;
                        _data.photo_path = 'Delete';
                        this._settingPhotoService.updateData(_data);
                        const sumMonth = new Date(y + '/' + m + '/' + _d);
                        data.time_start = sumMonth;
                        this._settingPhotoService.addDataAutoMode(data);
                      }
                    }
                  });
                });
              }
            } else {
              const lastYear = 12 - _m;
              if (m + lastYear === data.select_mode) {
                let _mm = '' + _m;
                let mm = '' + m;
                if (_m < 10) {
                  _mm = '0' + _m;
                }
                const i = m - 1;
                if (i < 10) {
                  mm = '0' + i;
                }
                const start = _y + '-' + _mm + '-' + '00';
                const end = y + '-' + mm + '-' + '32';
                this._settingPhotoService.requestDataByCodeDate(start, end).subscribe((listData) => {
                  listData.map((_data) => {
                    if (_data.photo_path === 'Delete') {
                      _data.check_in_photo = this.noImg;
                      this._settingPhotoService.updateData(_data);
                      const sumMonth = new Date(y + '/' + m + '/' + _d);
                      data.time_start = sumMonth;
                      this._settingPhotoService.addDataAutoMode(data);
                    } else {
                      if (_data.photo_path === undefined) {
                        _data.check_in_photo = this.noImg;
                        _data.photo_path = 'Delete';
                        this._settingPhotoService.updateData(_data);
                        const sumMonth = new Date(y + '/' + m + '/' + _d);
                        data.time_start = sumMonth;
                        this._settingPhotoService.addDataAutoMode(data);
                      } else {
                        this._uploadService.deleteFile(_data.photo_path);
                        _data.check_in_photo = this.noImg;
                        _data.photo_path = 'Delete';
                        this._settingPhotoService.updateData(_data);
                        const sumMonth = new Date(y + '/' + m + '/' + _d);
                        data.time_start = sumMonth;
                        this._settingPhotoService.addDataAutoMode(data);
                      }
                    }
                  });
                });
              }
            }
          }
        });
      }
    });
  }
}
