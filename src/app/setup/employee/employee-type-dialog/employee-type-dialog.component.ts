import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, Gallery} from 'ng-gallery';
import {Upload} from '../../../shared/model/upload';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import {EmployeeType} from '../employee-type';
import {EmployeeTypeService} from '../employee-type.service';
import {ItemType} from '../../item-type/item-type';
import {DepartmentService} from '../../department/department.service';
import {Department} from '../../department/department';

@Component({
  selector: 'app-settings-item-type-dialog',
  templateUrl: './employee-type-dialog.component.html',
  styleUrls: ['./employee-type-dialog.component.scss'],
  providers: [EmployeeTypeService, UploadService, DepartmentService]
})

export class EmployeeTypeDialogComponent implements OnInit {
  @Language() lang: string;
  config: GalleryConfig;

  data: EmployeeType = new EmployeeType({});
  disableSelect = new FormControl(true);
  error: any;
  images = [];
  departmants = [];
  storage_ref = '/main/settings/employee';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: EmployeeType,
              private _employeetypeService: EmployeeTypeService,
              private _loadingService: TdLoadingService,
              private _uploadService: UploadService,
              public _departmentService: DepartmentService,
              public gallery: Gallery,
              public dialogRef: MatDialogRef<EmployeeTypeDialogComponent>) {

    try {
      if (md_data) {
        this.data = new EmployeeType(md_data);
        if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }
      } else {
        this.displayImage('../../../../../assets/images/user.png');
        this._employeetypeService.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit() {
    this.getDepartmentData();
  }

  getDepartmentData() {
    this._departmentService.requestData().subscribe((snapshot) => {
      this._departmentService.rows = [];
      snapshot.forEach((s) => {

        const _row = new Department(s.val());
        this.departmants.push(_row);
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
    this._loadingService.register('data.form');
    // const prefix = 'TYPE';
    this.data.code = '1001';
    this._employeetypeService.requestLastData().subscribe((s) => {
      s.forEach((ss: EmployeeType) => {
        console.log('Prev Code :' + ss.code);
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

  uploadImage(file: File) {
    this._loadingService.register();
    // let file = event.target.files.item(0);

    const file_type = file.name.substring(file.name.lastIndexOf('.'));

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

  // disableSelectChange() {
  //   this.data.disableSelect = this.disableSelect.value;
  //   console.log('Func Active is : ' + this.data.disableSelect);
  // }

  openLink(link: string) {
    window.open(link, '_blank');
  }

}
