import { Component, OnInit } from '@angular/core';
import {Language} from 'angular-l10n';
import * as _ from 'lodash';
import {TdLoadingService} from '@covalent/core';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SetCompanyProfile} from './set-company-profile';
import {SetCompanyProfileService} from './set-company-profile.service';
import {UploadService} from '../../../app/services/upload.service';
import {Upload} from '../../shared/model/upload';
import {GalleryConfig, Gallery} from 'ng-gallery';

@Component({
  selector: 'app-set-company-profile',
  templateUrl: '../set-company-profile/set-company-profile.component.html',
  styleUrls: ['../set-company-profile/set-company-profile.component.scss'],
  providers: [SetCompanyProfileService, UploadService]
})
export class SetCompanyProfileComponent implements OnInit {
  @Language() lang: string;
  config: GalleryConfig;

  data: SetCompanyProfile = new SetCompanyProfile({});
  loading: boolean = true;

  error: any;

  temp = [];
  storage_ref = '/main/settings/set_company_profile';
  images = [];

  constructor(private _setcompanyprofile: SetCompanyProfileService,
              private _loadingService: TdLoadingService,
              public snackBar: MatSnackBar,
              private _uploadService: UploadService,
              public gallery: Gallery,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this._setcompanyprofile.requestDataByCode('1').subscribe((snapshot) => {

      const _row = new SetCompanyProfile(snapshot);
      this.data = _row;
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
        data: form.value.code + ' : ' + form.value.company
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this.data.company = form.value.company ? form.value.company : null;
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
      text: this.data.company
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
