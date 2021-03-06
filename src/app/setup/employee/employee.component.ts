import {Component, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../shared/model/page';
import {Language} from 'angular-l10n';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {SelectionModel} from '@angular/cdk/collections';
import { LogsDialogComponent } from '../../dialog/logs-dialog/logs-dialog.component';
import { Logs } from '../../dialog/logs-dialog/logs';
import { LogsService } from '../../dialog/logs-dialog/logs.service';
import {EmployeeTypeService} from './employee-type.service';
import {EmployeeType} from './employee-type';
import {EmployeeTypeDialogComponent} from './employee-type-dialog/employee-type-dialog.component';
import {AuthService} from '../../login/auth.service';
import { version as appVersion } from '../../../../package.json';
import * as firebase from 'firebase';

@Component({
  selector: 'app-settings-item_type',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [EmployeeTypeService, LogsService, AuthService]
})
export class EmployeeComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;
  public appVersion;
  user: firebase.User;
  loading: boolean = true;

  company_check = '';

  page = new Page();
  cache: any = {};
  // expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _employeetypeService: EmployeeTypeService,
              private _logService: LogsService,
              private _authService: AuthService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {

    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;

    this.page.size = 20;
    this.page.pageNumber = 0;

  }
  ngOnInit(): void {
    this.setEmployee();
  }

  load() {
    this.loading = true;
    this._employeetypeService.requestData().subscribe((snapshot) => {
      this._employeetypeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new EmployeeType(s.val());
        if (s.val().company_code === this.company_check) {
          if (s.val().resing === 'green') {
            this._employeetypeService.rows.push(_row);
          }
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

  addData() {
    const dialogRef = this.dialog.open(EmployeeTypeDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '75%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  editData(data: EmployeeType) {
    const dialogRef = this.dialog.open(EmployeeTypeDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '75%',
      data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  deleteData(data: EmployeeType) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete employee',
        content: 'Confirm to delete?',
        data_title: 'Employee',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._employeetypeService.removeData(data).then(() => {
          this.snackBar.open('Delete employee succeed.', '', {duration: 3000});
          this.addLog('Delete', 'delete employee succeed', data, {});

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

  setEmployee() {
    this._employeetypeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _employeedata = new EmployeeType(snapshot[0]);
      this.company_check = _employeedata.company_code;
      this.load();
    });
  }
}
