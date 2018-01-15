import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemSubGroupService } from '../item-sub-group/item-sub-group.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import {Language} from 'angular-l10n';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {SelectionModel} from '@angular/cdk/collections';
import { ItemSubGroupDialogComponent } from '../item-sub-group/item-sub-group-dialog/item-sub-group-dialog.component';
import { Page } from '../../shared/model/page';
import { ItemSubGroup } from '../item-sub-group/item-sub-group';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';
import { LogsDialogComponent } from '../../dialog/logs-dialog/logs-dialog.component';
import { Logs } from '../../dialog/logs-dialog/logs';
import { LogsService } from '../../dialog/logs-dialog/logs.service';

@Component({
  selector: 'app-settings-item-sub-group',
  templateUrl: './item-sub-group.component.html',
  styleUrls: ['./item-sub-group.component.scss'],
  providers: [ItemSubGroupService, LogsService]
})
export class ItemSubGroupComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _itemsubgroupService: ItemSubGroupService,
              private _logService: LogsService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {

    this.page.size = 10;
    this.page.pageNumber = 0;

  }
  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this._itemsubgroupService.requestData().subscribe((snapshot) => {
      this._itemsubgroupService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemSubGroup(s.val());
        this._itemsubgroupService.rows.push(_row);

      });

      this.temp = [...this._itemsubgroupService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._itemsubgroupService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(ItemSubGroupDialogComponent, {
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

  editData(data: ItemSubGroup) {
    const dialogRef = this.dialog.open(ItemSubGroupDialogComponent, {
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

  deleteData(data: ItemSubGroup) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete item sub group',
        content: 'Confirm to delete?',
        data_title: 'Item Sub Group',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._itemsubgroupService.removeData(data).then(() => {
          this.snackBar.open('Delete item sub group succeed.', '', {duration: 3000});
          // this.addLog('Delete', 'delete item sub group succeed', data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  enableData(data: ItemSubGroup) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'enable',
        title: 'Enable item sub group',
        content: 'Item sub group with enabled will be able to use',
        data_title: 'Item Sub Group',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._itemsubgroupService.updateDataStatus(data, false).then(() => {
          this.snackBar.open('Enable item sub group succeed', '', {duration: 3000});

          const new_data = new ItemSubGroup(data);
          new_data.disable = false;
          this.addLog('Enable', 'enable item sub ggroup succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });

  }

  disableData(data: ItemSubGroup) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'disable',
        title: 'Disable item sub group',
        content: 'Item sub group with disabled are not able to use',
        data_title: 'Item Sub Group',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._itemsubgroupService.updateDataStatus(data, true).then(() => {
          this.snackBar.open('Disable item sub group succeed', '', {duration: 3000});

          const new_data = new ItemSubGroup(data);
          new_data.disable = false;
          this.addLog('Disable', 'disable item sub group succeed', new_data, data);

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
        // (d.item_type && d.item_type.toLowerCase().indexOf(val) !== -1) ||
        (d.name1 && d.name1.toLowerCase().indexOf(val) !== -1) ||
        (d.name2 && d.name2.toLowerCase().indexOf(val) !== -1)
        || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  openLogs(data: ItemSubGroup) {
    this.dialog.open(LogsDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Item Sub Group',
        path: this._itemsubgroupService.getPath(),
        ref: data ? data.code : null
      },
    });
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._itemsubgroupService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._itemsubgroupService.getPath(), log);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
