import {Component, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../shared/model/page';
import {Language} from 'angular-l10n';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {SelectionModel} from '@angular/cdk/collections';
import {ItemTypeDialogComponent} from './item-type-dialog/item-type-dialog.component';
import {ItemTypeService} from './item-type.service';
import {ItemType} from './item-type';
import { LogsDialogComponent } from '../../dialog/logs-dialog/logs-dialog.component';
import { Logs } from '../../dialog/logs-dialog/logs';
import { LogsService } from '../../dialog/logs-dialog/logs.service';
import * as firebase from 'firebase';
import { version as appVersion } from '../../../../package.json';
import {AuthService} from '../../login/auth.service';
import {EmployeeTypeService} from '../employee/employee-type.service';
import {EmployeeType} from '../employee/employee-type';

@Component({
  selector: 'app-settings-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.scss'],
  providers: [ItemTypeService, LogsService, AuthService, EmployeeTypeService]
})
export class ItemTypeComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;
  public appVersion;
  user: firebase.User;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];
  company_check = '';

  constructor(private _itemtypeService: ItemTypeService,
              private _logService: LogsService,
              private _employeetypeService: EmployeeTypeService,
              private _authService: AuthService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;
    this.page.size = 10;
    this.page.pageNumber = 0;

  }
  ngOnInit(): void {
    this.setEmployee();
  }

  load() {
    this.loading = true;
    this._itemtypeService.requestData().subscribe((snapshot) => {
      this._itemtypeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemType(s.val());
        if (_row.company_code === this.company_check) {
          this._itemtypeService.rows.push(_row);
        }
      });

      this.temp = [...this._itemtypeService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._itemtypeService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(ItemTypeDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '25%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  editData(data: ItemType) {
    const dialogRef = this.dialog.open(ItemTypeDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '25%',
      data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  deleteData(data: ItemType) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete item type',
        content: 'Confirm to delete?',
        data_title: 'Item Type',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._itemtypeService.removeData(data).then(() => {
          this.snackBar.open('Delete item type succeed.', '', {duration: 3000});
          this.addLog('Delete', 'delete item type succeed', data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  enableData(data: ItemType) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'enable',
        title: 'Enable item type',
        content: 'Item type with enabled will be able to use',
        data_title: 'Item Type',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._itemtypeService.updateDataStatus(data, false).then(() => {
          this.snackBar.open('Enable item type succeed', '', {duration: 3000});

          const new_data = new ItemType(data);
          new_data.disable = false;
          this.addLog('Enable', 'enable item type succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });

  }

  disableData(data: ItemType) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'disable',
        title: 'Disable item type',
        content: 'Item type with disabled are not able to use',
        data_title: 'Item Type',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._itemtypeService.updateDataStatus(data, true).then(() => {
          this.snackBar.open('Disable item type succeed', '', {duration: 3000});

          const new_data = new ItemType(data);
          new_data.disable = false;
          this.addLog('Disable', 'disable item type succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  updateFilter(event) {
    if (event === '') {
      this.setPage(null);
      return;
    }

    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return (d.code.toLowerCase().indexOf(val) !== -1) ||
        (d.name1 && d.name1.toLowerCase().indexOf(val) !== -1) ||
        (d.name2 && d.name2.toLowerCase().indexOf(val) !== -1)
        || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  openLogs(data: ItemType) {
    this.dialog.open(LogsDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Item Type',
        path: this._itemtypeService.getPath(),
        ref: data ? data.code : null
      },
    });
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    console.log('operation ' + operation);
    console.log('description ' + description);
    console.log('data' + data);
    console.log('old' + old);
    // const log = new Logs({});
    // log.path = this._itemtypeService.getPath();
    // log.ref = data.code;
    // log.operation = operation;
    // log.description = description;
    // log.old_data = old;
    // log.new_data = data;
    // this._logService.addLog(this._itemtypeService.getPath(), log);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  setEmployee() {
    this._employeetypeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _employeedata = new EmployeeType(snapshot[0]);
      this.company_check = _employeedata.company_code;
      this.load();
    });
  }
}
