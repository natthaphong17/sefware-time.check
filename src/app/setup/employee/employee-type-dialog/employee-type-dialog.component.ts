// <reference path="../../../../../node_modules/@angular/http/src/interfaces.d.ts"/>
import {Component, Inject, OnInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule, MatSnackBar} from '@angular/material';
import {GalleryConfig, Gallery} from 'ng-gallery';
import {AuthService} from '../../../login/auth.service';
import {Upload} from '../../../shared/model/upload';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import {EmployeeType} from '../employee-type';
import {EmployeeTypeService} from '../employee-type.service';
import {DepartmentService} from '../../department/department.service';
import {Department} from '../../department/department';
import * as firebase from 'firebase';
import { version as appVersion } from '../../../../../package.json';
import {HolidaysService} from '../../holidays/holidays.service';
import {Http, RequestOptions} from '@angular/http';

@Component({
  selector: 'app-settings-item-type-dialog',
  templateUrl: './employee-type-dialog.component.html',
  styleUrls: ['./employee-type-dialog.component.scss'],
  providers: [EmployeeTypeService, UploadService, DepartmentService, AuthService, HolidaysService]
})

export class EmployeeTypeDialogComponent implements OnInit {
  @Language() lang: string;
  config: GalleryConfig;
  public appVersion;

  data: EmployeeType = new EmployeeType({} as EmployeeType);
  dataBeforeEdit: any = [];
  error: any;
  images = [];
  departmants = [];
  storage_ref = '/main/settings/employee';
  user: firebase.User;
  company_check = '';
  _file: any;
  holidays = [
    {value: '10', viewValue: '10'},
    {value: '11', viewValue: '11'},
    {value: '12', viewValue: '12'},
    {value: '13', viewValue: '13'},
    {value: '14', viewValue: '14'},
    {value: '15', viewValue: '15'}
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: EmployeeType,
              private _employeetypeService: EmployeeTypeService,
              private _loadingService: TdLoadingService,
              private _uploadService: UploadService,
              private _authService: AuthService,
              public _departmentService: DepartmentService,
              public gallery: Gallery,
              public http: Http,
              public dialogRef: MatDialogRef<EmployeeTypeDialogComponent>,
              public snackBar: MatSnackBar,
              public _holidayService: HolidaysService) {

    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;

    try {
      if (md_data) {
        this.data = new EmployeeType(md_data);
        this.dataBeforeEdit = new EmployeeType(md_data);
        if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }
      } else {
        this.displayImage('../../../../../assets/images/user.png');
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit() {
    this.setEmployee();
    this.getHoliday();
  }

  getDepartmentData() {
    this._departmentService.requestData().subscribe((snapshot) => {
      this._departmentService.rows = [];
      snapshot.forEach((s) => {

        const _row = new Department(s.val());
        if (_row.company_code === this.company_check) {
          this.departmants.push(_row);
        }
      });
    });
  }

  displayImage(path: string) {
    this.images = [];
    this.images.push({
      src: path,
      thumbnail: path,
      text: this.data.name1
    });
    this.gallery.load(this.images);
  }

  generateCode() {
    // const prefix = 'TYPE';
    this.data.code = '1001';
    this._employeetypeService.requestLastData(this.company_check).subscribe((s) => {
      s.forEach((ss: EmployeeType) => {
        if (ss.resing !== 'Admin') {
          // tslint:disable-next-line:radix
          const str = parseInt(ss.emp_code.substring(ss.emp_code.length - 4, ss.emp_code.length)) + 1;
          this.data.code = this.company_check + '-' + str;
        }
      });
    });
  }

  uploadImage(file: File) {
    this._loadingService.register();
    // let file = event.target.files.item(0);
    this._file = file;

    const file_type = file.name.substring(file.name.lastIndexOf('.'));
    console.log(file);
    // this.displayImage(file.name);

    this._uploadService.pushUpload('image/*', this.storage_ref + '/' + this.data.code + '/' + this.data.code + '_' + new Date().getTime() + file_type, new Upload(file)).then((result) => {
      this.data.image = result.downloadURL;
      this.images = [];
      this.displayImage(this.data.image);
      this._loadingService.resolve();
    }).catch((err) => {
      console.log('err : ' + err.message);
      this._loadingService.resolve();
    });
  }

  uploadApiImage(file: File) {
    // POST  https://api.ontime-demo.app/api/upload/{employee_id}
    const _url = 'https://api.ontime-demo.app/api/upload/' + this.data.code;
    const formData = new FormData();

    // formData.append('image', imageSrc.split(',').pop());
    formData.append('image', file);

    // const headers = new Headers();
    // headers.set('X-Requested-With', 'XMLHttpRequest');
    // const options = new RequestOptions(<RequestOptionsArgs>headers);

    this.http.post(_url, formData).subscribe((_data) => {
        // console.log('llllllllllllll' + _data);
      });

    // this.http.get(_url);
  }

  removeImage() {
    this.data.image = '../../../../../assets/images/placeholder.png';
    this.displayImage(this.data.image);
  }

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      this.data.name1 = form.value.name1 ? form.value.name1 : null;

      const emp_code = this.data.code.substring(this.data.code.length - 4, this.data.code.length);
      this.data.emp_code = emp_code;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
          this._loadingService.resolve();
        } else {
          if ((this.data.image !== this.md_data.image) &&
            (this.data.image !== '../../../../../assets/images/placeholder.png')) {
              this.uploadApiImage(this._file);
          }

          this._employeetypeService.removeData(this.dataBeforeEdit).then(() => {
            this._employeetypeService.updateData(this.data).then(() => {
              this.dialogRef.close(this.data);
              this._loadingService.resolve();
            }).catch((err) => {
              this.error = err.message;
              this._loadingService.resolve();
            });
          }).catch((err) => {
            this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
          });
        }
      } else {
        this._employeetypeService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  setEmployee() {
    this._employeetypeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _row = new EmployeeType(snapshot[0]);
      this.data.company_code = _row.company_code;
      this.data.resing = 'green';
      this.company_check = _row.company_code;
      if (this.data.emp_code === undefined) {
        this.generateCode();
      }
      this.getDepartmentData();
    });
  }

  getHoliday() {
    this._employeetypeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      this._holidayService.requestData().subscribe((snapshot1) => {
        let num = 0;
        snapshot1.forEach((s) => {
          if (s.val().company_code === snapshot[0].company_code) {
            num++;
          }
        });
        num = num - 10;
        // setting this is the key to initial select.
        this.data.holidays = this.holidays[num].value;
      });
    });
  }
}
