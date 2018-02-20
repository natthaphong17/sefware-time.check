import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { Department } from '../department';
import { DepartmentService } from '../department.service';
import { UploadService } from '../../../services/upload.service';
import { FormControl } from '@angular/forms';
import { version as appVersion } from '../../../../../package.json';
import {EmployeeTypeService} from '../../employee/employee-type.service';
import {AuthService} from '../../../login/auth.service';
import {GalleryConfig} from 'ng-gallery';
import * as firebase from 'firebase';
import {EmployeeType} from '../../employee/employee-type';

@Component({
  selector: 'app-department-dialog',
  templateUrl: './department-dialog.component.html',
  styleUrls: ['./department-dialog.component.scss'],
  providers: [DepartmentService, EmployeeTypeService, AuthService]
})
export class DepartmentDialogComponent implements OnInit {

  config: GalleryConfig;
  public appVersion;
  user: firebase.User;
  data: Department = new Department({});
  disableSelect = new FormControl(true);
  error: any;
  images = [];
  storage_ref = '/main/settings/department';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Department,
              private _departmentService: DepartmentService,
              private _loadingService: TdLoadingService,
              private _employeetypeService: EmployeeTypeService,
              private _authService: AuthService,
              public dialogRef: MatDialogRef<DepartmentDialogComponent>) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;
    try {
      if (md_data) {
        this.data = new Department(md_data);
        this.disableSelect = new FormControl(this.data.disableSelect);
      } else {
        this._departmentService.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit(): void {
    this.setEmployee();
  }

  generateCode() {
    this._loadingService.register('data.form');
    // const prefix = 'DPM';
    // this.data.code = prefix + '-001';
    this.data.code = '001';
    this._departmentService.requestLastData().subscribe((s) => {
      s.forEach((ss: Department) => {
        console.log('Prev Code :' + ss.code);
        // tslint:disable-next-line:radix
        const str = parseInt(ss.code.substring(ss.code.length - 3, ss.code.length)) + 1;
        let last = '' + str;

        if (str < 100) {
          last = '0' + str;
        }

        if (str < 10) {
          last = '00' + str;
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

      this.data.name1 = form.value.name1 ? form.value.name1 : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
        } else {
          this._departmentService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._departmentService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }

  disableSelectChange() {
    this.data.disableSelect = this.disableSelect.value;
    console.log('Func Active is : ' + this.data.disableSelect);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  setEmployee() {
    this._employeetypeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _row = new EmployeeType(snapshot[0]);
      this.data.company_code = _row.company_code;
    });
  }

}
