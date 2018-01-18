import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, Gallery} from 'ng-gallery';
import {Upload} from '../../../shared/model/upload';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import {WorkingTimeSettingType} from '../../workingtimesetting/workingtimesetting-type';
import {WorkingtimesettingTypeService} from '../../workingtimesetting/workingtimesetting-type.service';

@Component({
  selector: 'app-workingtimesetting-dialog',
  templateUrl: './workingtimesetting-type-dialog.component.html',
  styleUrls: ['./workingtimesetting-type-dialog.component.scss'],
  providers: [WorkingtimesettingTypeService, UploadService]
})

export class WorkingtimesettingTypeDialogComponent implements OnInit {
  @Language() lang: string;

  disableSelect = new FormControl(true);
  data: WorkingTimeSettingType = new WorkingTimeSettingType({});

  error: any;
  images = [];

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: WorkingTimeSettingType,
              private _workingtimesettingService: WorkingtimesettingTypeService,
              public dialogRef: MatDialogRef<WorkingtimesettingTypeDialogComponent>,
              private _loadingService: TdLoadingService) {
    try {
      if (md_data) {
        this.data = new WorkingTimeSettingType(md_data);
        this.disableSelect = new FormControl(this.data.disableSelect);
        /*if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }*/

      } else {
        // this.displayImage('../../../../../assets/images/user.png');
        this._workingtimesettingService.requestData().subscribe(() => {
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
    this._workingtimesettingService.requestLastData().subscribe((s) => {
      s.forEach((ss: WorkingTimeSettingType) => {
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

      this.data.late = form.value.late ? form.value.late : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
        } else {
          this._workingtimesettingService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._workingtimesettingService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }

}
