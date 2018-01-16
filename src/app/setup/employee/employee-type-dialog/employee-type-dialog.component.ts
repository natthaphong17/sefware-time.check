import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, /*GalleryService*/} from 'ng-gallery';
import {Upload} from '../../../shared/model/upload';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import {EmployeeType} from '../employee-type';
import {EmployeeTypeService} from '../employee-type.service';

@Component({
  selector: 'app-settings-item-type-dialog',
  templateUrl: './employee-type-dialog.component.html',
  styleUrls: ['./employee-type-dialog.component.scss'],
  providers: [EmployeeTypeService, UploadService]
})

export class EmployeeTypeDialogComponent implements OnInit {
  @Language() lang: string;

  data: EmployeeType = new EmployeeType({});
  disableSelect = new FormControl(true);
  error: any;
  images = [];
  storage_ref = '/main/settings/item_type';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: EmployeeType,
              private _employeetypeService: EmployeeTypeService,
              private _loadingService: TdLoadingService,
              public dialogRef: MatDialogRef<EmployeeTypeDialogComponent>) {

    try {
      if (md_data) {
        this.data = new EmployeeType(md_data);
        this.disableSelect = new FormControl(this.data.disableSelect);
        /*if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }*/

      } else {
        // this.displayImage('../../../../../assets/images/user.png');
        this._employeetypeService.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit(): void {
  }

  generateCode() {
    this._loadingService.register('data.form');
    // const prefix = 'TYPE';
    // this.data.code = prefix + '-001';
    this.data.code = '1';
    this._employeetypeService.requestLastData().subscribe((s) => {
      s.forEach((ss: EmployeeType) => {
        console.log('Prev Code :' + ss.code);
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

      this.data.name1 = form.value.name1 ? form.value.name1 : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
        } else {
          this._employeetypeService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
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

  disableSelectChange() {
    this.data.disableSelect = this.disableSelect.value;
    console.log('Func Active is : ' + this.data.disableSelect);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

}
