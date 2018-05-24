import {Component, Inject, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HolidaysService } from '../holidays.service';
import { Holidays } from '../holidays';
import {LogsService} from '../../../dialog/logs-dialog/logs.service';
import {Language} from 'angular-l10n';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import {EmployeeType} from '../../employee/employee-type';
import { version as appVersion } from '../../../../../package.json';
import * as firebase from 'firebase';
import {AuthService} from '../../../login/auth.service';
import {EmployeeTypeService} from '../../employee/employee-type.service';

@Component({
  selector: 'app-holidays-dialog',
  templateUrl: './holidays-dialog.component.html',
  styleUrls: ['./holidays-dialog.component.scss'],
  providers: [HolidaysService, LogsService, AuthService, EmployeeTypeService]
})
export class HolidaysDialogComponent implements OnInit {
  @Language() lang: string;
  public appVersion;
  user: firebase.User;

  disableSelect = new FormControl(true);
  data: Holidays = new Holidays({} as Holidays);

  error: any;
  images = [];

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Holidays,
              private _holidaysService: HolidaysService,
              private _authService: AuthService,
              private _employeetypeService: EmployeeTypeService,
              public dialogRef: MatDialogRef<HolidaysDialogComponent>,
              private _loadingService: TdLoadingService) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;
    try {
      if (md_data) {
        this.data = new Holidays(md_data);
        this.disableSelect = new FormControl();
        /*if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }*/

      } else {
        // this.displayImage('../../../../../assets/images/user.png');
        this._holidaysService.requestData().subscribe(() => {
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
    this.data.code = '01';
    this._holidaysService.requestLastData().subscribe((s) => {
      s.forEach((ss: Holidays) => {
        // tslint:disable-next-line:radix
        const str = parseInt(ss.code.substring(ss.code.length - 2, ss.code.length)) + 1;
        let last = '' + str;

        if (str < 10) {
          last = '0' + str;
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
          this._holidaysService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._holidaysService.addData(this.data).then(() => {
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
      const _company = new EmployeeType(snapshot[0]);
      this.data.company_code = _company.company_code;
    });
  }

}
