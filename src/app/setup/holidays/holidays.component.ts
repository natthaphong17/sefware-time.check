import {Component, OnInit, ViewChild} from '@angular/core';
import {Language} from 'angular-l10n';
import {Page} from '../../shared/model/page';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HolidaysDialogComponent} from './holidays-dialog/holidays-dialog.component';
import {HolidaysService} from './holidays.service';
import {LogsService} from '../../dialog/logs-dialog/logs.service';
import {Holidays} from './holidays';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {Logs} from '../../dialog/logs-dialog/logs';
import {EmployeeType} from '../employee/employee-type';
import { version as appVersion } from '../../../../package.json';
import * as firebase from 'firebase';
import {AuthService} from '../../login/auth.service';
import {EmployeeTypeService} from '../employee/employee-type.service';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],
  providers: [HolidaysService, LogsService, AuthService, EmployeeTypeService]
})
export class HolidaysComponent implements OnInit {
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

  constructor(private dialog: MatDialog,
              public snackBar: MatSnackBar,
              private _authService: AuthService,
              private _employeetypeService: EmployeeTypeService,
              private _logService: LogsService,
              private _holidaysService: HolidaysService) {

    this._authService.user.subscribe((user) => {
      this.user = user;
    });

    this.appVersion = appVersion;

    this.page.size = 10;
    this.page.pageNumber = 0;
  }

  ngOnInit() {
    this.setEmployee();
  }
  load() {
    this.loading = true;
    this._holidaysService.requestData().subscribe((snapshot) => {
      this._holidaysService.rows = [];
      snapshot.forEach((s) => {

        const _row = new Holidays(s.val());
        if (_row.company_code === this.company_check) {
          this._holidaysService.rows.push(_row);
        }
      });

      this.temp = [...this._holidaysService.rows];
      this.loading = false;
      this.setPage(null);
    });

  }
  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._holidaysService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }
  addData() {
    const dialogRef = this.dialog.open(HolidaysDialogComponent, {
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
  editData(data: Holidays) {
    const dialogRef = this.dialog.open(HolidaysDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '50%',
      data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }
  deleteData(data: Holidays) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete Holiday',
        content: 'Confirm to delete?',
        data_title: 'Holiday',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._holidaysService.removeData(data).then(() => {
          this.snackBar.open('Delete holiday succeed.', '', {duration: 3000});
          // this.addLog('Delete', 'delete item succeed', data, {});
        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }
  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._holidaysService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._holidaysService.getPath(), log);
  }

  setEmployee() {
    this._employeetypeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _employeedata = new EmployeeType(snapshot[0]);
      this.company_check = _employeedata.company_code;
      this.load();
    });
  }
}
