import { Component, Inject, OnInit } from '@angular/core';
import { CheckTime } from '../check-time/check-time';
import { Language } from 'angular-l10n';
import { AdminTestPhotoService } from './admin-test-photo.service';
import * as _ from 'lodash';
import { TdLoadingService } from '@covalent/core';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';
import { version as appVersion } from '../../../../package.json';
import { MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { EmployeeType } from '../employee/employee-type';
import * as firebase from 'firebase';
import { AuthService } from '../../login/auth.service';
import { EmployeeTypeService } from '../employee/employee-type.service';
import { count } from '@angular/cli/node_modules/rxjs/operators';
import { WorkingTimeSettingType } from '../workingtimesetting/workingtimesetting-type';
import { UploadService } from '../../services/upload.service';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { Upload } from '../../shared/model/upload';
import { CheckTimeService } from '../check-time/check-time.service';

@Component({
  selector: 'admin-test-photo',
  templateUrl: './admin-test-photo.component.html',
  styleUrls: ['./admin-test-photo.component.scss'],
  providers: [AuthService, EmployeeTypeService, AdminTestPhotoService, UploadService, CheckTimeService]
})
export class AdminTestPhotoComponent implements OnInit {
  @Language() lang: string;

  data: CheckTime = new CheckTime({} as CheckTime);
  loading: boolean = true;
  company_check = '';
  public appVersion;
  user: firebase.User;

  error: any;
  company_code = '';
  employee_code = '';
  temp = [];

  storage_ref = 'main/settings/checking';

  time_hours = [];
  time_minutes = [];

  emp_code = '';
  emp_check_in_code = '';
  emp_check_in: Date;
  emp_hours = '';
  emp_minutes = '';
  emp_status = '';
  constructor(private _adminTestPhotoService: AdminTestPhotoService,
    private _checkTimeService: CheckTimeService,
    private _loadingService: TdLoadingService,
    private _employeeService: EmployeeTypeService,
    public _authService: AuthService,
    private _uploadService: UploadService) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;
  }

  ngOnInit() {
    this.setEmployee();
    this.generateTime();
  }

  load() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _data = new EmployeeType(snapshot[0]);
      this.loading = true;
      console.log('See Conpany Code : ' + _data.company_code);
      // this._settingNetworkLocal.requestData().subscribe((snapshotB) => {
      //   snapshotB.forEach((s) => {
      //     const _row = new CheckTime(s.val());
      //     if (s.val().company_code === _data.company_code) {
      //       console.log('See Row : ' + JSON.stringify(_row));
      //       this.data = _row;
      //     }
      //   });
      // });
      this.loading = false;
    });
  }
  setEmployee() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _employeedata = new EmployeeType(snapshot[0]);
      this.company_check = _employeedata.company_code;
      this.employee_code = _employeedata.code;
      console.log(this.employee_code);
      this.load();
    });
  }

  uploadImage(file: File) {
    this._loadingService.register();
    // let file = event.target.files.item(0);
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    let _day = day + '';
    let _month = month + '';
    if (month < 10) {
      _month = '0' + month;
    }
    if (day < 10) {
      _day = '0' + day;
    }

    const file_type = file.name.substring(file.name.lastIndexOf('.'));

    this._uploadService.pushUpload('image/*', this.storage_ref + '/' + year + _month + _day + '/' + '_' + this.emp_code + file_type, new Upload(file)).then((result) => {
      const newData = new CheckTime(result[0]);
      newData.code = this.emp_check_in_code;
      newData.employee_code = this.emp_code;
      newData.check_in_photo = result.downloadURL;
      newData.date = new Date() + '';
      newData.check_in_time = new Date() + '';
      newData.photo_path = this.storage_ref + '/' + year + month + day + '/' + '_' + this.emp_code + file_type;
      console.log(newData);
      this._checkTimeService.addData(newData);
      this._loadingService.resolve();
    }).catch((err) => {
      console.log('err : ' + err.message);
      this._loadingService.resolve();
    });
  }

  updateData(form) {
    const newDate = new Date();
    this.emp_check_in = newDate;
    this.emp_code = form.value.employee_code;

    const month01 = newDate.getMonth() + 1;
    let _month01 = month01 + '';
    if (month01 < 10) {
      _month01 = '0' + month01;
    }
    const day01 = newDate.getDate();
    let _day01 = day01 + '';
    if (day01 < 10) {
      _day01 = '0' + day01;
    }
    console.log(this.emp_code);

    this.emp_check_in_code = this.emp_code + '-' + newDate.getFullYear() + _month01 + _day01;

    console.log(this.emp_check_in_code);
    console.log(this.emp_check_in);
  }

  generateTime() {
    for (let i = 0; i < 60; i++) {
      let _i = '' + i;
      if (i < 10) {
        _i = '0' + i;
      }
      if (i < 24) {
        this.time_hours.push(_i);
      }
      this.time_minutes.push(_i);

    }
  }
}
