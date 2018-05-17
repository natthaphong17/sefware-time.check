import { Component, Inject, OnInit } from '@angular/core';
import { CheckTime } from '../check-time/check-time';
import { Language } from 'angular-l10n';
import * as _ from 'lodash';
import { TdLoadingService } from '@covalent/core';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';
import { version as appVersion } from '../../../../package.json';
import { MAT_DIALOG_DATA, MatDialog, MatSnackBar, fadeInContent } from '@angular/material';
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
import { SettingPhotoService } from '../setting-photo/setting-photo.service';

@Component({
  selector: 'setting-photo',
  templateUrl: './setting-photo.component.html',
  styleUrls: ['./setting-photo.component.scss'],
  providers: [AuthService, EmployeeTypeService, UploadService, CheckTimeService, SettingPhotoService]
})
export class SettingPhotoComponent implements OnInit {
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

  noImg = '../../../assets/images/user.jpg';

  startDate: string;
  endDate: string;

  showErorr = false;
  showErorrText: string;
  showSuccessText: string;
  checkShowSuccessTextfalse = false;
  checkShowSuccessTextTrue = false;

  deleteAllPhotosErorrText: string;
  deleteAllPhotosErorr = false;
  deleteAllPhotosText: string;
  deleteAllPhotosPage = false;
  deleteAllPhotosSuccessText: string;
  deleteAllPhotosSuccess = false;

  page2Text: string;

  checkNextPage = true;
  btnGoPage1 = false;
  page1 = true;
  page2 = false;
  page3 = false;

  btnAutoMode = false;
  autoModeText: string;
  autoModeDetail = false;
  checkAutoMode = false;
  checkAutoModeDiv = false;
  checkAutoModeText: string;
  checkAutoModeDivActive = false;
  checkAutoModeDivActiveText: string;

  constructor(private _checkTimeService: CheckTimeService,
    private _settingPhotoService: SettingPhotoService,
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
  }

  load() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _data = new EmployeeType(snapshot[0]);
      this.loading = true;
      this.company_code = _data.company_code;
      this.loading = false;
    });
    this._settingPhotoService.requestDateByAutoModeCode('1').subscribe((mode) => {
      if (mode.length === 0) {
        this.btnAutoMode = false;
        const newAutoMode = { code: '1', auto_mode: false, select_mode: '0', time_start: new Date() };
        this._settingPhotoService.addDataAutoMode(newAutoMode);
      } else {
        mode.map((_mode) => {
          this.btnAutoMode = _mode.auto_mode;
          this.checkAutoModeDivActive = _mode.auto_mode;
          this.checkAutoModeDivActiveText = 'Function Active Delete Photos Every ' + _mode.select_mode + ' Month';
          if (this.btnAutoMode === true) {
            this.autoModeDetail = true;
            this.autoModeText = 'On';
          } else {
            this.autoModeDetail = false;
            this.autoModeText = 'Off';
          }
        });
      }
    });
  }
  setEmployee() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _employeedata = new EmployeeType(snapshot[0]);
      this.company_check = _employeedata.company_code;
      this.employee_code = _employeedata.code;
      this.load();
    });
  }

  updateData(form) {
    let putStartDay = '';
    let putStartMonth = '';
    let putEndDay = '';
    let putEndMonth = '';
    this.checkNextPage = true;
    const startDay = new Date(form.value.startInputDate).getDate();
    const startMonth = new Date(form.value.startInputDate).getMonth() + 1;
    const startYear = new Date(form.value.startInputDate).getFullYear();
    const endDay = new Date(form.value.endInputDate).getDate();
    const endMonth = new Date(form.value.endInputDate).getMonth() + 1;
    const endYear = new Date(form.value.endInputDate).getFullYear();

    putStartDay = putStartDay + startDay;
    putStartMonth = putStartMonth + startMonth;
    putEndDay = putEndDay + endDay;
    putEndMonth = putEndMonth + endMonth;
    ////////////////// IF CHECK DATA INPUT /////////////////////////////////
    if (form.value.startInputDate === undefined) {
      this.showErorr = true;
      this.showErorrText = 'Please check date ** Start Date !';
      this.checkNextPage = false;
    }
    if (form.value.endInputDate === undefined) {
      this.showErorr = true;
      this.showErorrText = 'Please check date ** End Date !';
      this.checkNextPage = false;
    }
    /////////////////////////////////////////////////////
    if (startDay < 10) {
      putStartDay = '0' + startDay;
    }
    if (endDay < 10) {
      putEndDay = '0' + endDay;
    }
    if (startMonth < 10) {
      putStartMonth = '0' + startMonth;
    }
    if (endMonth < 10) {
      putEndMonth = '0' + endMonth;
    }
    if (startYear > endYear) {
      this.showErorr = true;
      this.showErorrText = 'Please check date **Year';
      this.checkNextPage = false;
    }
    if (startYear === endYear) {
      if (startMonth > endMonth) {
        this.showErorr = true;
        this.showErorrText = 'Please check date **Month';
        this.checkNextPage = false;
      }
    }
    if (startYear === endYear && startMonth === endMonth) {
      if (startDay > endDay) {
        this.showErorr = true;
        this.showErorrText = 'Please check date **Day';
        this.checkNextPage = false;
      } else if (startDay === endDay) {
        console.log('--------');
        const toInt = endDay + 1;
        this.page2Text = '' + startYear + '-' + putStartMonth + '-' + startDay;
        putEndDay = '' + toInt;
        if (toInt < 10) {
          putEndDay = '0' + toInt;
          console.log('+++' + putEndDay);
        }
      } else {
        this.page2Text = '' + startYear + '-' + putStartMonth + '-' + startDay + ' => ' + endYear + '-' + putEndMonth + '-' + endDay;
      }
    }
    /////////////////// END IF /////////////////////////////
    this.startDate = startYear + '-' + putStartMonth + '-' + putStartDay;
    this.endDate = endYear + '-' + putEndMonth + '-' + putEndDay;
    console.log(this.startDate + '---' + this.endDate);
    if (this.checkNextPage === true) {
      this.goPage2();
    }
  }
  goPage2() {
    this.page1 = false;
    this.page2 = true;
    this.page3 = false;
  }
  goPage1() {
    this.page1 = true;
    this.page2 = false;
    this.page3 = false;
  }
  goPage3() {
    this.page1 = false;
    this.page2 = false;
    this.page3 = true;
    this._loadingService.register();
    this._settingPhotoService.requestDataByCodeDate(this.startDate, this.endDate).subscribe((listData) => {
      listData.map((_data) => {
        if (_data.photo_path === 'Delete') {
          _data.check_in_photo = this.noImg;
          this._settingPhotoService.updateData(_data);
        } else {
          if (_data.photo_path === undefined) {
            _data.check_in_photo = this.noImg;
            _data.photo_path = 'Delete';
            this._settingPhotoService.updateData(_data);
            // console.log(_data);
          } else {
            console.log('ELSE');
            this._uploadService.deleteFile(_data.photo_path);
            _data.check_in_photo = this.noImg;
            _data.photo_path = 'Delete';
            this._settingPhotoService.updateData(_data);
          }
        }
        // console.log(_data);
      });
      if (listData.length === 0) {
        this.showSuccessText = 'Please back to check date !';
        this.checkShowSuccessTextTrue = true;
        this.checkShowSuccessTextfalse = false;
        this.btnGoPage1 = true;
      } else {
        this.showSuccessText = 'Successfully deleted photos !';
        this.checkShowSuccessTextfalse = true;
        this.checkShowSuccessTextTrue = false;
        this.btnGoPage1 = false;
      }
      if (this.checkShowSuccessTextfalse === false && this.checkShowSuccessTextTrue === false) {
        this.showSuccessText = 'Successfully deleted photos !';
      }
      console.log(listData.length);
    });
    this._loadingService.resolve();
  }

  deleteAllPhotos() {
    this.deleteAllPhotosSuccess = false;
    this.deleteAllPhotosPage = true;
    this.deleteAllPhotosText = 'Warning ! : You sure to delete all photos. Click "CONFIRM" for delete';
    this.deleteAllPhoto2();
  }
  deleteAllPhoto2() {
    this._settingPhotoService.requestDataByPhotoPath().subscribe((ss) => {
      console.log('222 --- ' + ss.length);
      if (ss.length === 0) {
        this.deleteAllPhotosText = '';
        this.deleteAllPhotosSuccess = false;
        this.deleteAllPhotosPage = false;
        this.deleteAllPhotosErorr = true;
        this.deleteAllPhotosErorrText = 'Delete all photos success !';
      } else {
        this.deleteAllPhotosErorr = false;
      }
    });
  }
  deleteAllPhoto3() {
    this._settingPhotoService.requestDataByPhotoPath().subscribe((ss) => {
      console.log('+++' + ss.length);
      ss.map((_ss) => {
        if (_ss.photo_path === undefined) {
          _ss.check_in_photo = this.noImg;
          _ss.photo_path = 'Delete';
          this._settingPhotoService.updateData(_ss);
          this.deleteAllPhotosSuccess = true;
          this.deleteAllPhotosSuccessText = 'Delete all photos success !';
          this.deleteAllPhotosPage = false;
          this.deleteAllPhotosErorr = false;
          console.log(_ss);
        } else {
          console.log('ELSE');
          this._uploadService.deleteFile(_ss.photo_path);
          _ss.check_in_photo = this.noImg;
          _ss.photo_path = 'Delete';
          this._settingPhotoService.updateData(_ss);
          this.deleteAllPhotosSuccess = true;
          this.deleteAllPhotosSuccessText = 'Delete all photos success !';
          this.deleteAllPhotosPage = false;
          this.deleteAllPhotosErorr = false;
          console.log(_ss);
        }
      });
    });
  }
  deleteAllPhotosCancel() {
    this.deleteAllPhotosSuccess = false;
    this.deleteAllPhotosPage = false;
    this.deleteAllPhotosErorr = false;
  }

  autoModePage1() {
    this.autoModeDetail = true;
    if (this.autoModeText === 'Off') {
      this.autoModeText = 'On';
    } else {
      this.autoModeDetail = false;
      this.autoModeText = 'Off';
      const data = { code: '1', auto_mode: false };
      this._settingPhotoService.addDataAutoMode(data);
    }
    console.log(this.autoModeText);
  }

  autoModePage2(form) {
    this.checkAutoModeDiv = false;
    this.checkAutoMode = true;
    console.log(form.value.deleteEvery);
    console.log(form.value.functionStart);
    if (form.value.deleteEvery === undefined || form.value.functionStart === undefined) {
      this.checkAutoModeDiv = true;
      this.checkAutoMode = false;
      this.checkAutoModeText = 'Please select an option !';
    } else {
      if (form.value.functionStart === '2') {
        const d = new Date().getDate() + 1;
        const m = new Date().getMonth() + 2;
        const y = new Date().getFullYear();
        const sumMonth = new Date(y + '/' + m + '/' + d);
        console.log(sumMonth);
        const data = {
          code: '1',
          time_start: sumMonth,
          select_mode: form.value.deleteEvery,
          auto_mode: true
        };
        this._settingPhotoService.addDataAutoMode(data);
      } else {
        const d = new Date().getDate() + 1;
        const m = new Date().getMonth() + 1;
        const y = new Date().getFullYear();
        const sumMonth = new Date(y + '/' + m + '/' + d);
        console.log(sumMonth);
        const data = {
          code: '1',
          time_start: sumMonth,
          select_mode: form.value.deleteEvery,
          auto_mode: true
        };
        this._settingPhotoService.addDataAutoMode(data);
      }
    }
  }
}
