import {Component, Inject, OnInit} from '@angular/core';
import {Language} from 'angular-l10n';
import * as _ from 'lodash';
import {TdLoadingService} from '@covalent/core';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {SetCompanyProfile} from './set-company-profile';
import {SetCompanyProfileService} from './set-company-profile.service';
import {UploadService} from '../../../app/services/upload.service';
import {Upload} from '../../shared/model/upload';
import {GalleryConfig, Gallery} from 'ng-gallery';
import {Item} from '../item/item';
import {FormControl} from '@angular/forms';
import {EmployeeType} from '../employee/employee-type';
import { version as appVersion } from '../../../../package.json';
import * as firebase from 'firebase';
import {AuthService} from '../../login/auth.service';
import {EmployeeTypeService} from '../employee/employee-type.service';

@Component({
  selector: 'app-set-company-profile',
  templateUrl: '../set-company-profile/set-company-profile.component.html',
  styleUrls: ['../set-company-profile/set-company-profile.component.scss'],
  providers: [SetCompanyProfileService, UploadService, EmployeeTypeService]
})
export class SetCompanyProfileComponent implements OnInit {
  @Language() lang: string;
  config: GalleryConfig;
  public appVersion;
  user: firebase.User;

  data: SetCompanyProfile = new SetCompanyProfile({});
  loading: boolean = true;

  error: any;

  company_code = '';

  temp = [];
  storage_ref = '/main/settings/set_company_profile';
  images = [];

  constructor(private  _setcompanyprofile: SetCompanyProfileService,
              private _loadingService: TdLoadingService,
              public snackBar: MatSnackBar,
              private _uploadService: UploadService,
              public _authService: AuthService,
              public gallery: Gallery,
              private _employeeService: EmployeeTypeService,
              private dialog: MatDialog) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });

    this.appVersion = appVersion;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _data = new EmployeeType(snapshot[0]);

      this.loading = true;
      this._setcompanyprofile.requestDataByCode(_data.company_code).subscribe((snapshotB) => {
        const _row = new SetCompanyProfile(snapshotB);
        try {
          if (_row) {
            console.log(_row);
            this.data = new SetCompanyProfile(_row);
            if (!this.data.image) {
              this.displayImage('../../../../../assets/images/placeholder.png');
            } else {
              this.displayImage(this.data.image);
            }
          } else {
            this.displayImage('../../../../../assets/images/placeholder.png');
          }
        } catch (error) {
          this.error = error;
        }
        // this.data = _row;
      });
    });
    this.loading = false;
  }

  saveData(form) {
    console.log(form.value.company);
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'edit',
        title: 'Edit Set Company Profile',
        content: 'Confirm to Edit?',
        data_title: 'Set Company Profile',
        data: form.value.company_name1 + ' : ' + form.value.company_name2
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this.data.company_name1 = form.value.company_name1 ? form.value.company_name1 : null;
        this._setcompanyprofile.updateData(this.data).then(() => {
          this.snackBar.open('Edit Setting Network Local to complete' , '', {duration: 3000});
        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  displayImage(path: string) {
    this.images = [];
    this.images.push({
      src: path,
      thumbnail: path,
      text: this.data.company_name1
    });
    this.gallery.load(this.images);
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
}
