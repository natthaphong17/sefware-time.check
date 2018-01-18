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
  config: GalleryConfig;

  data: WorkingTimeSettingType = new WorkingTimeSettingType({});
  disableSelect = new FormControl(true);
  error: any;
  images = [];
  storage_ref = '/main/settings/employee';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: WorkingTimeSettingType,
              private _workingtimesettingtypeService: WorkingtimesettingTypeService,
              private _loadingService: TdLoadingService,
              private _uploadService: UploadService,
              public gallery: Gallery,
              public dialogRef: MatDialogRef<WorkingtimesettingTypeDialogComponent>) {

    try {
      if (md_data) {
        this.data = new WorkingTimeSettingType(md_data);
        if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }

      } else {
        this.displayImage('../../../../../assets/images/user.png');
        this._workingtimesettingtypeService.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit(): void {
  }
  displayImage(path: string) {
    this.images = [];
    this.images.push({
      src: path,
      thumbnail: path,
      text: this.data.checkin
    });
    this.gallery.load(this.images);
  }
  generateCode() {
    this._loadingService.register('data.form');
    // const prefix = 'TYPE';
    // this.data.id = prefix + '1001';
    this._workingtimesettingtypeService.requestLastData().subscribe((s) => {
      s.forEach((ss: WorkingTimeSettingType) => {
        console.log('Prev Code :' + ss.id);
        // tslint:disable-next-line:radix
        const str = parseInt(ss.id.substring(ss.id.length - 1, ss.id.length)) + 1;
        const last = '' + str;

        /*let last = prefix + '-' + str;

        if (str < 100) {
          last = prefix + '-0' + str;
        }

        if (str < 10) {
          last = prefix + '-00' + str;
        }*/

        this.data.id = last;
      });
      this._loadingService.resolve('data.form');
    });
  }

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      this.data.checkin = form.value.checkin ? form.value.checkin : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
        } else {
          this._workingtimesettingtypeService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._workingtimesettingtypeService.addData(this.data).then(() => {
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

}
