import {Component, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../../../shared/model/page';
import {Language} from 'angular-l10n';
import {ConfirmComponent} from '../../../../dialog/confirm/confirm.component';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {SelectionModel} from '@angular/cdk/collections';
import { LogsDialogComponent } from '../../../../dialog/logs-dialog/logs-dialog.component';
import { Logs } from '../../../../dialog/logs-dialog/logs';
import { LogsService } from '../../../../dialog/logs-dialog/logs.service';
import {EmployeeTypeService} from '../../../../setup/employee/employee-type.service';
import {EmployeeType} from '../../../../setup/employee/employee-type';

@Component({
  selector: 'app-undo',
  templateUrl: './undo.component.html',
  styleUrls: ['./undo.component.scss'],
  providers: [EmployeeTypeService, LogsService]
})
export class UndoComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  // expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _employeetypeService: EmployeeTypeService,
              private _logService: LogsService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {

    this.page.size = 20;
    this.page.pageNumber = 0;

  }
  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this._employeetypeService.requestData().subscribe((snapshot) => {
      this._employeetypeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new EmployeeType(s.val());
        if (s.val().resing === 'red') {
          this._employeetypeService.rows.push(_row);
        }
      });

      this.temp = [...this._employeetypeService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._employeetypeService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
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

  openLogs(data: EmployeeType) {
    this.dialog.open(LogsDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Employee Type',
        path: this._employeetypeService.getPath(),
        ref: data ? data.code : null
      },
    });
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._employeetypeService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._employeetypeService.getPath(), log);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  undoResign(data: EmployeeType) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'undo',
        title: 'Undo employee',
        content: 'Confirm to Undo Resign ?',
        data_title: 'Undo Resign Employee',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        const data1 = { code : data.code , resing : 'green'};
        this._employeetypeService.updateData(data1 as EmployeeType).then(() => {
          this.snackBar.open('Undo employee succeed.', '', {duration: 3000});
          this.addLog('Undo', 'Undo employee succeed', data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }
}
