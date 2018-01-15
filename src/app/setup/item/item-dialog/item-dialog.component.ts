import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, Gallery} from 'ng-gallery';
import {Upload} from '../../../shared/model/upload';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';

/*
Load data
*/
import { ItemService } from '../item.service';
import { ItemTypeService } from '../../item-type/item-type.service';
import { ItemGroupService } from '../../item-group/item-group.service';
import { ItemSubGroupService } from '../../item-sub-group/item-sub-group.service';
import { Item } from '../item';
import { ItemType } from '../../item-type/item-type';
import { ItemGroup } from '../../item-group/item-group';
import { ItemSubGroup } from '../../item-sub-group/item-sub-group';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss'],
  providers: [ItemService, ItemTypeService, ItemGroupService, ItemSubGroupService, UploadService]
})

export class ItemDialogComponent implements OnInit {

  @Language() lang: string;

  config: GalleryConfig;

  data: Item = new Item({});
  disableSelect = new FormControl(true);
  error: any;
  images = [];
  types = [];
  groups = [];
  subgroups = [];
  uoms = [];
  codes = '0000-0001';
  edit = false;
  storage_ref = '/main/settings/item';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Item,
              private _itemService: ItemService,
              private _itemtypeService: ItemTypeService,
              private _itemgroupService: ItemGroupService,
              private _itemsubgroupService: ItemSubGroupService,
              private _uploadService: UploadService,
              private _loadingService: TdLoadingService,
              public gallery: Gallery,
              public dialogRef: MatDialogRef<ItemDialogComponent>) {

    try {
      if (md_data) {
        this.data = new Item(md_data);
        if (!this.data.image) {
          this.displayImage('../../../../../assets/images/placeholder.png');
        } else {
          this.displayImage(this.data.image);
        }
        // console.log('DATA : ' + JSON.stringify(this.data));
        this.codes = this.data.code;
        this.disableSelect = new FormControl(this.data.disableSelect);
        this.getItemGroupData(this.data.type_code);
        this.getItemSubGroupData(this.data.group_code);
        this.getItemData(this.data.subgroup_code);

      } else {
        this.displayImage('../../../../../assets/images/placeholder.png');
        this._itemService.requestData().subscribe(() => {
          this.generateCode(null);
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit() {
    this.getItemTypeData();
  }

  getItemTypeData() {
    this._itemtypeService.requestData().subscribe((snapshot) => {
      this._itemtypeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemType(s.val());
        this.types.push(_row);
      });
    });
  }

  getItemGroupData(typeCode) {
    this.groups = [];
    this.subgroups = [];
    this._itemgroupService.requestDataByType(typeCode).subscribe((snapshot) => {
      this._itemgroupService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemGroup(s);
        this.groups.push(_row);
      });
    });
    this.getItemData(typeCode + '000');
  }

  getItemSubGroupData(groupCode) {
    this.subgroups = [];
    this._itemsubgroupService.requestDataByGroup(groupCode).subscribe((snapshot) => {
      this._itemsubgroupService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemSubGroup(s);
        this.subgroups.push(_row);
      });
    });
    this.getItemData(groupCode + '00');
  }

  getItemData(Code) {
    // ฟังก์ชั่นตรวจสอบว่ารหัสเดิม มีอยู่หรือไม่ และ อยู่ในประเภทได ก่อนนำไป Genarate Code
    if (this.codes.substr(0, 4) === Code) {
      if (this.data.type_code === Code.substr(0, 1)) {
        this.edit = true;
        this.generateCode(Code);
        if (this.data.group_code === Code.substr(0, 2)) {
          this.edit = true;
          this.generateCode(Code);
          if (this.data.subgroup_code === Code.substr(0, 4)) {
            this.edit = true;
            this.generateCode(Code);
          } else {
            this.data.subgroup_code = this.codes.substr(0, 4);
            this.edit = true;
          }
        } else {
          this.data.group_code = this.codes.substr(0, 2);
          this.edit = true;
        }
      } else {
        this.data.type_code = this.codes.substr(0, 1);
        this.edit = true;
      }
    } else {
      this.edit = false;
      this.generateCode(Code);
    }
  /*
    console.log('Data Code :' + this.codes.substr(0, 4));
    console.log('Code :' + Code);
  */
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

  generateCode(Code) {
    if (this.disableSelect.value === true) {
      this._loadingService.register('data.form');
      let prefix = '0000';
      if (Code !== null) {
        prefix = Code;
      }
      this.data.code = prefix + '-0001';
      this._itemService.requestLastData(prefix).subscribe((s) => {
        // console.log('Prev Code :' + JSON.stringify(s));
        s.forEach((ss: Item) => {
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
          this._itemService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._itemService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
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

  disableSelectChange() {
    this.data.disableSelect = this.disableSelect.value;
    console.log('Func Active is : ' + this.data.disableSelect);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

}
