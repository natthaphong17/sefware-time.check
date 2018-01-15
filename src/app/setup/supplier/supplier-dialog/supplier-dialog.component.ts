import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, /*GalleryService*/} from 'ng-gallery';
import {Upload} from '../../../shared/model/upload';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import { SupplierService } from '../supplier.service';
import { Supplier } from '../supplier';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings-supplier-dialog',
  templateUrl: './supplier-dialog.component.html',
  styleUrls: ['./supplier-dialog.component.scss'],
  providers: [SupplierService]
})

export class SupplierDialogComponent implements OnInit {
  @Language() lang: string;

  data: Supplier = new Supplier({});
  disableSelect = new FormControl(true);
  supplierTypes = [
    {value: 'credit', name: 'Credit'},
    {value: 'petty_cash', name: 'Petty Cash'},
  ];
  error: any;
  images = [];
  storage_ref = '/main/settings/supplier';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Supplier,
              private _supplierService: SupplierService,
              private _loadingService: TdLoadingService,
              public dialogRef: MatDialogRef<SupplierDialogComponent>) {

    try {
      if (md_data) {
        this.data = new Supplier(md_data);
        this.disableSelect = new FormControl(this.data.disableSelect);
        /*if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }*/

      } else {
        // this.displayImage('../../../../../assets/images/user.png');
        this._supplierService.requestData().subscribe(() => {
          this.generateCode(null);
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit(): void {
  }

  generateCode(supplierType) {
    this._loadingService.register('data.form');
    let prefix = 'sup';
    if (supplierType === 'credit') {
      prefix = 'c';
    } else if (supplierType === 'petty_cash') {
      prefix = 'p';
    }
    this.data.code = prefix + '-0001';
    this._supplierService.requestLastData(prefix).subscribe((s) => {
      s.forEach((ss: Supplier) => {
        console.log('Prev Code :' + ss.code);
        // tslint:disable-next-line:radix
        const str = parseInt(ss.code.substring(ss.code.length - 4, ss.code.length)) + 1;
        let last = prefix + '-' + str;

        if (str < 1000) {
          last = prefix + '-0' + str;
        }

        if (str < 100) {
          last = prefix + '-00' + str;
        }

        if (str < 10) {
          last = prefix + '-000' + str;
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
          this._supplierService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._supplierService.addData(this.data).then(() => {
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
