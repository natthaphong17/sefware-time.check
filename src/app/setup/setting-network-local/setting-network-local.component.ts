import { Component, OnInit } from '@angular/core';
import {SettingNetworkLocal} from './setting-network-local';
import {Language} from 'angular-l10n';
import {WorkingtimesettingTypeService} from './setting-network-local.service';
import * as _ from 'lodash';
import {TdLoadingService} from '@covalent/core';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-setting-network-local',
  templateUrl: './setting-network-local.component.html',
  styleUrls: ['./setting-network-local.component.scss'],
  providers: [WorkingtimesettingTypeService]
})
export class SettingNetworkLocalComponent implements OnInit {
  @Language() lang: string;

  data: SettingNetworkLocal = new SettingNetworkLocal({});
  loading: boolean = true;

  error: any;

  temp = [];

  constructor(private _settingNetworkLocal: WorkingtimesettingTypeService,
              private _loadingService: TdLoadingService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this._settingNetworkLocal.requestDataByCode('1').subscribe((snapshot) => {

        const _row = new SettingNetworkLocal(snapshot);
        this.data = _row;
    });
    this.loading = false;
  }

  changeLocal(form) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'edit',
        title: 'Edit Setting Network Local',
        content: 'Confirm to Edit?',
        data_title: 'Setting Network Local',
        data: form.value.code + ' : ' + form.value.local
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this.data.local = form.value.local ? form.value.local : null;
        this._settingNetworkLocal.updateData(this.data).then(() => {
          this.snackBar.open('Edit Setting Network Local to' + form.local + ' ' , '', {duration: 3000});
        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }
}
