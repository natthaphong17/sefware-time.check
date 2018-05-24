import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, Gallery} from 'ng-gallery';
import {Upload} from '../../../../shared/model/upload';
import {UploadService} from '../../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import {TakeLeaveService} from '../take-leave.service';
import {TakeLeave} from '../take-leave';
import {EmployeeType} from '../../../../setup/employee/employee-type';
import { version as appVersion } from '../../../../../../package.json';
import {AuthService} from '../../../../login/auth.service';
import {EmployeeTypeService} from '../../../../setup/employee/employee-type.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-add-take-leave-dialog',
  templateUrl: './add-take-leave-dialog.component.html',
  styleUrls: ['./add-take-leave-dialog.component.scss'],
  providers: [TakeLeaveService, UploadService, AuthService, EmployeeTypeService]
})

export class AddTakeLeaveDialogComponent implements OnInit {
  @Language() lang: string;
  public appVersion;
  user: firebase.User;

  disableSelect = new FormControl(true);
  data: TakeLeave = new TakeLeave({} as TakeLeave);

  error: any;
  images = [];
  company_check = '';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: TakeLeave,
              private _takeleaveService: TakeLeaveService,
              private _employeetypeService: EmployeeTypeService,
              private _authService: AuthService,
              public dialogRef: MatDialogRef<AddTakeLeaveDialogComponent>,
              private _loadingService: TdLoadingService) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;
    try {
      if (md_data) {
        this.data = new TakeLeave(md_data);
        this.generateCode();

      } else {
        this._takeleaveService.requestData().subscribe(() => {
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

  generateCode() {
    this._loadingService.register('data.form');
    // const prefix = 'TYPE';
    // this.data.code = prefix + '-001';
    this.data.code = '1';
    this._takeleaveService.requestLastData().subscribe((s) => {
      s.forEach((ss: TakeLeave) => {
        // tslint:disable-next-line:radix
        const str = parseInt(ss.code) + 1;
        const last = '' + str;

        this.data.code = last;
      });
      this._loadingService.resolve('data.form');
    });
  }

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      // this.data.late = form.value.late ? form.value.late : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
        } else {
          this._takeleaveService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._takeleaveService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }

  setEmployee() {
    this._employeetypeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _row = new EmployeeType(snapshot[0]);
      this.data.company_code = _row.company_code;
      this.company_check = _row.company_code;
    });
  }

}
