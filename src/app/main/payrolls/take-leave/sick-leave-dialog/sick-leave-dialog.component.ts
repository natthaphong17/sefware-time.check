import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule, MatSnackBar} from '@angular/material';
import {GalleryConfig, Gallery} from 'ng-gallery';
import {Upload} from '../../../../shared/model/upload';
import {UploadService} from '../../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import {TakeLeaveService} from '../take-leave.service';
import {TakeLeave} from '../take-leave';
import {config} from 'shelljs';

@Component({
  selector: 'app-sick-leave-dialog',
  templateUrl: './sick-leave-dialog.component.html',
  styleUrls: ['./sick-leave-dialog.component.scss'],
  providers: [TakeLeaveService, UploadService]
})

export class SickLeaveDialogComponent implements OnInit {
  @Language() lang: string;

  disableSelect = new FormControl(true);
  data: TakeLeave = new TakeLeave({});

  error: any;
  images = [];
  showDateResult = '';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: TakeLeave,
              private _takeleaveService: TakeLeaveService,
              public snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<SickLeaveDialogComponent>,
              private _loadingService: TdLoadingService) {
    try {
      if (md_data) {
        this.data = new TakeLeave(md_data);
        console.log('+++>>> : ' + JSON.stringify(md_data));
        // this.disableSelect = new FormControl(this.data.disableSelect);
        /*if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }*/

      } else {
        // this.displayImage('../../../../../assets/images/user.png');
        this._takeleaveService.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit() {
  }

  generateCode() {
    this._loadingService.register('data.form');
    // const prefix = 'TYPE';
    // this.data.code = prefix + '-001';
    this.data.code = '1';
    this._takeleaveService.requestLastData().subscribe((s) => {
      s.forEach((ss: TakeLeave) => {
        console.log('Prev Code :' + ss.code );
        // tslint:disable-next-line:radix
        const str = parseInt(ss.code.substring(ss.code.length - 1, ss.code.length)) + 1;
        const last = '' + str;

        /*let last = prefix + '-' + str;

        if (str < 100) {
          last = prefix + '-0' + str;
        }

        if (str < 10) {
          last = prefix + '-00' + str;
        }*/

        this.data.code = last;
      });
      this._loadingService.resolve('data.form');
    });
  }

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      this.data.name = form.value.late ? form.value.late : null;

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
  checkDate(_data) {
    console.log('======== Start ========= :' + _data.value.sick_leave_start.getUTCDate());
    console.log('======== Stop ==========  :' + _data.value.sick_leave_stop.getDate());
    console.log('======== Date ==========  :' + new Date().toJSON());
    this.snackBar.dismiss();
    if (_data.value.sick_leave_start >= new Date()) {
      if (_data.value.sick_leave_start === _data.value.sick_leave_stop) {
        this.snackBar.open('End Date should be greater than start date.', '', {duration: 3000});
      } else if (_data.value.sick_leave_start > _data.value.sick_leave_stop) {
        this.snackBar.open('Start date should not be before today.', '', {duration: 3000});
      } else if (_data.value.sick_leave_start < _data.value.sick_leave_stop) {
        this.snackBar.open('Start date should not be before today.', '', {duration: 3000});
      } else {
        this.snackBar.open('*****.');
      }
    } else {
      this.snackBar.open('Please select date today or more.', '', {duration: 3000});
    }
  }

  updateSickLeave(_data) {
    console.log('======== Start ========= :' + _data.value.sick_leave_start);
    console.log('======== Stop ==========  :' + _data.value.sick_leave_stop);
    // this._takeleaveService.updateData(this.data);
    // _data.value.sick_leave_start.getDay();
  }
  // console(log) {
  //   console.log('+++>>> : ' + log);
  // }

}
