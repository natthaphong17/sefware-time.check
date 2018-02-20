import {Component, Inject, OnInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
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
import {Department} from '../../department/department';
import * as firebase from 'firebase';
import {SetCompanyProfileService} from '../../set-company-profile/set-company-profile.service';
import {SetCompanyProfile} from '../../set-company-profile/set-company-profile';

@Component({
  selector: 'app-add-employee-admin',
  templateUrl: './add-employee-admin.component.html',
  styleUrls: ['./add-employee-admin.component.scss'],
  providers: [EmployeeTypeService, UploadService, SetCompanyProfileService, AuthService]
})

export class AddEmployeeAdminComponent implements OnInit {
  @Language() lang: string;
  config: GalleryConfig;

  data: EmployeeType = new EmployeeType({} as EmployeeType);
  disableSelect = new FormControl(true);
  error: any;
  images = [];
  companyList = [];
  storage_ref = '/main/settings/employee';
  user: firebase.User;

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: EmployeeType,
              private _employeetypeService: EmployeeTypeService,
              private _loadingService: TdLoadingService,
              private _uploadService: UploadService,
              private _authService: AuthService,
              public _setcompanyService: SetCompanyProfileService,
              public gallery: Gallery,
              public dialogRef: MatDialogRef<AddEmployeeAdminComponent>) {

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
    this.getCompanyData();
    this.setAdmin();
  }

  getCompanyData() {
    this._setcompanyService.requestData().subscribe((snapshot) => {
      this._setcompanyService.rows = [];
      snapshot.forEach((s) => {

        const _row = new SetCompanyProfile(s.val());
        this.companyList.push(_row);
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

  removeImage() {
    this.data.image = '../../../../../assets/images/placeholder.png';
    this.displayImage(this.data.image);
    // this.displayImage('../../../../../assets/images/placeholder.png');
  }

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      this.data.name1 = form.value.name1 ? form.value.name1 : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
          this._loadingService.resolve();
        } else {
          this._employeetypeService.updateData(this.data).then(() => {
            this._authService.createUserWithEmailAndPassword(this.data.email);
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._employeetypeService.addData(this.data).then(() => {
          this._authService.createUserWithEmailAndPassword(this.data.email);
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

  setAdmin() {
      this.data.resing = 'Admin';
  }
}
