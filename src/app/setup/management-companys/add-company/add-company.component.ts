import {Component, Inject, OnInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, Gallery} from 'ng-gallery';
import {AuthService} from '../../../login/auth.service';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import * as firebase from 'firebase';
import {ManagementCompanys} from '../management-companys';
import {ManagementCompanysService} from '../management-companys.service';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-app-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
  providers: [ManagementCompanysService, UploadService, AuthService]
})

export class AddCompanyComponent implements OnInit {
  @Language() lang: string;
  config: GalleryConfig;

  data: ManagementCompanys = new ManagementCompanys({} as ManagementCompanys);
  disableSelect = new FormControl(true);
  error: any;
  user: firebase.User;

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: ManagementCompanys,
              private _managementcompanyService: ManagementCompanysService,
              private _loadingService: TdLoadingService,
              public gallery: Gallery,
              public dialogRef: MatDialogRef<AddCompanyComponent>) {

    try {
      if (md_data) {
        this.data = new ManagementCompanys(md_data);
      } else {
        this._managementcompanyService.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit() {
    this.randomCode();
    // this.getDepartmentData();
  }

  // getDepartmentData() {
  //   this._departmentService.requestData().subscribe((snapshot) => {
  //     this._departmentService.rows = [];
  //     snapshot.forEach((s) => {
  //
  //       const _row = new Department(s.val());
  //       this.departmants.push(_row);
  //     });
  //   });
  // }

  generateCode() {
    this._loadingService.register('data.form');
    // const prefix = 'TYPE';
    this.data.code = '0001';
    this._managementcompanyService.requestLastData().subscribe((s) => {
      s.forEach((ss: ManagementCompanys) => {
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

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      this.data.company_name1 = form.value.company_name1 ? form.value.company_name1 : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
          this._loadingService.resolve();
        } else {
          this._managementcompanyService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._managementcompanyService.addData(this.data).then(() => {
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

  randomCode() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return this.data.license = text;
  }

}
