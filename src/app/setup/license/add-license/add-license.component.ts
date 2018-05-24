import {Component, Inject, OnInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, Gallery} from 'ng-gallery';
import {AuthService} from '../../../login/auth.service';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import * as firebase from 'firebase';
import {forEach} from '@angular/router/src/utils/collection';
import {License} from '../license';
import {LicenseService} from '../license.service';
import {EmployeeType} from '../../employee/employee-type';
import {EmployeeTypeService} from '../../employee/employee-type.service';
import { version as appVersion } from '../../../../../package.json';

@Component({
  selector: 'app-add-license',
  templateUrl: './add-license.component.html',
  styleUrls: ['./add-license.component.scss'],
  providers: [LicenseService, UploadService, AuthService, EmployeeTypeService]
})

export class AddLicenseComponent implements OnInit {
  @Language() lang: string;
  config: GalleryConfig;

  public appVersion;

  data: License = new License({} as License);
  disableSelect = new FormControl(true);
  error: any;
  user: firebase.User;
  disbleBtnSave = true;
  disbleBtnRandom = false;

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: License,
              private _licenseService: LicenseService,
              private _loadingService: TdLoadingService,
              public gallery: Gallery,
              public _authService: AuthService,
              private _employeeService: EmployeeTypeService,
              public dialogRef: MatDialogRef<AddLicenseComponent>) {

    this._authService.user.subscribe((user) => {
      this.user = user;
    });

    this.appVersion = appVersion;

    try {
      if (md_data) {
        this.data = new License(md_data);
      } else {
        this._licenseService.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit() {
    this.randomCode();
    // this.setUser();
    // this.getDepartmentData();
  }

  // getDepartmentData() {
  //   this._departmentService.requestData().subscribe((snapshot) => {
  //     this._departmentService.rows = [];
  //     snapshot.forEach((s) => {
  //
  //       const _row = new Department(s.val());
  //       this.departmants.push(_row);
  //     });
  //   });
  // }

  generateCode() {
    this._loadingService.register('data.form');
    // const prefix = 'TYPE';
    this.data.code = '0001';
    this._licenseService.requestLastData().subscribe((s) => {
      s.forEach((ss: License) => {
        // tslint:disable-next-line:radix
        const str = parseInt(ss.code.substring(ss.code.length - 4, ss.code.length)) + 1;
        let last = '' + str;

        if (str < 1000) {
          last = '0' + str;
        }

        if (str < 100) {
          last = '00' + str;
        }

        if (str < 10) {
          last = '000' + str;
        }

        this.data.code = last;
      });
      this._loadingService.resolve('data.form');
    });
  }

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      // this.data.time_length = form.value.time_length ? form.value.time_length : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
          this._loadingService.resolve();
        } else {
          this._licenseService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._licenseService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }

  // disableSelectChange() {
  //   this.data.disableSelect = this.disableSelect.value;
  //   console.log('Func Active is : ' + this.data.disableSelect);
  // }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  randomCode() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    // this._licenseService.requestData().subscribe((snapshot) => {
    //   snapshot.forEach((s) => {
    //     if (text === s.val().license) {
    //       this.disbleBtnSave = true;
    //       this.disbleBtnRandom = false;
    //       return this.data.license = text;
    //     } else {
    this.disbleBtnSave = false;
    //       this.disbleBtnRandom = true;
    return this.data.license = text;
    //     }
    //   });
    // });
  }

  // setUser() {
  //   this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
  //     const _row = new EmployeeType(snapshot[0]);
  //     console.log(this.user.email);
  //   });
  // }

}
