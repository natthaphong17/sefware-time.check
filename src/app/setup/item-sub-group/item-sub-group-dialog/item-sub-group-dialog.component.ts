import { Component, Inject, OnInit } from '@angular/core';
import {GalleryConfig, /*GalleryService*/} from 'ng-gallery';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ItemSubGroupService } from '../../item-sub-group/item-sub-group.service';
import { ItemGroupService } from '../../item-group/item-group.service';
import * as _ from 'lodash';
import { ItemSubGroup } from '../../item-sub-group/item-sub-group';
import { ItemGroup } from '../../item-group/item-group';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings-item-sub-group-dialog',
  templateUrl: './item-sub-group-dialog.component.html',
  styleUrls: ['./item-sub-group-dialog.component.scss'],
  providers: [ItemSubGroupService, ItemGroupService]
})
export class ItemSubGroupDialogComponent implements OnInit {
  @Language() lang: string;

  data: ItemSubGroup = new ItemSubGroup({});
  disableSelect = new FormControl(true);
  error: any;
  images = [];
  groups = [];
  codes = '0001';
  edit = false;
  storage_ref = '/main/settings/item_sub_group';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: ItemSubGroup,
              private _itemsubgroupService: ItemSubGroupService,
              private _itemgroupService: ItemGroupService,
              private _loadingService: TdLoadingService,
              public dialogRef: MatDialogRef<ItemSubGroupDialogComponent>) {

    try {
      if (md_data) {
        this.data = new ItemSubGroup(md_data);
        this.codes = this.data.code;
        this.disableSelect = new FormControl(this.data.disableSelect);
        this.getItemSubGroupData(this.data.group_code);
      } else {
        this._itemsubgroupService.requestData().subscribe(() => {
          this.generateCode(null);
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit(): void {
    this.getItemGroupData();
  }

  getItemGroupData() {
    this._itemgroupService.requestData().subscribe((snapshot) => {
      this._itemgroupService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemGroup(s.val());
        this.groups.push(_row);
      });
    });
  }

  getItemSubGroupData(Code) {
    // ฟังก์ชั่นตรวจสอบว่ารหัสเดิม มีอยู่หรือไม่ และ อยู่ในประเภทได ก่อนนำไป Genarate Code
    if (this.codes.substr(0, 2) === Code) {
      if (this.data.group_code === Code.substr(0, 2)) {
        this.edit = true;
        this.generateCode(Code);
      } else {
        this.data.group_code = this.codes.substr(0, 2);
        this.edit = true;
      }
    } else {
      this.edit = false;
      this.generateCode(Code);
    }
    /*
      console.log('Data Code :' + this.codes.substr(0, 2));
      console.log('Code :' + Code);
    */
  }

  generateCode(groupCode) {
    if (this.disableSelect.value === true) {
      this._loadingService.register('data.form');
      let prefix = '00';
      if (groupCode !== null) {
        prefix = groupCode;
      }
      this.data.code = prefix + '01';
      this._itemsubgroupService.requestLastData(prefix).subscribe((s) => {
        // console.log('Prev Code :' + JSON.stringify(s));
        s.forEach((ss: ItemSubGroup) => {
          console.log('Prev Code :' + ss.code);
          // tslint:disable-next-line:radix
          const str = parseInt(ss.code.substring(ss.code.length - 2, ss.code.length)) + 1;
          let last = prefix + str;
          if (str < 10) {
            last = prefix + '0' + str;
          }

          if (this.edit === true) {
            last = this.codes;
          }

          this.data.code = last;
        });
        this._loadingService.resolve('data.form');
      });
    }
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
          this._itemsubgroupService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._itemsubgroupService.addData(this.data).then(() => {
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
