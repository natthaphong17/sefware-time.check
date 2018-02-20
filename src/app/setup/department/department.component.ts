import { Component, OnInit, ViewChild } from '@angular/core';
import { Language } from 'angular-l10n';
import { DepartmentService } from './department.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TdLoadingService, TdMediaService } from '@covalent/core';
import { SelectionModel } from '@angular/cdk/collections';
import { DepartmentDialogComponent } from './department-dialog/department-dialog.component';
import { Page } from '../../shared/model/page';
import { Department } from './department';
import { ConfirmComponent } from '../../dialog/confirm/confirm.component';
import { LogsDialogComponent } from '../../dialog/logs-dialog/logs-dialog.component';
import { LogsService } from '../../dialog/logs-dialog/logs.service';
import { Logs } from '../../dialog/logs-dialog/logs';
import {EmployeeType} from '../employee/employee-type';
import { version as appVersion } from '../../../../package.json';
import {EmployeeTypeService} from '../employee/employee-type.service';
import {AuthService} from '../../login/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
  providers: [DepartmentService, LogsService, EmployeeTypeService, AuthService]
})
export class DepartmentComponent implements OnInit {

  @Language() lang: string;
  @ViewChild('dataTable') table: any;
  public appVersion;
  user: firebase.User;
  company_check ='';
  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _departmentService: DepartmentService,
              private _employeetypeService: EmployeeTypeService,
              private _authService: AuthService,
              private _logService: LogsService,
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
    this._departmentService.requestData().subscribe((snapshot) => {
      this._departmentService.rows = [];
      snapshot.forEach((s) => {

        const _row = new Department(s.val());
        if (_row.company_code === this.company_check) {
          this._departmentService.rows.push(_row);
        }
      });

      this.temp = [...this._departmentService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._departmentService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
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

  editData(data: Department) {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
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

  deleteData(data: Department) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete unit',
        content: 'Confirm to delete?',
        data_title: 'Department',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._departmentService.removeData(data).then(() => {
          this.snackBar.open('Delete unit succeed.', '', {duration: 3000});
          this.addLog('Delete', 'delete department succeed', data, {});
        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  enableData(data: Department) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'enable',
        title: 'Enable department',
        content: 'Department with enabled will be able to use',
        data_title: 'Department',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._departmentService.updateDataStatus(data, false).then(() => {
          this.snackBar.open('Enable department succeed', '', {duration: 3000});

          const new_data = new Department(data);
          new_data.disable = false;
          this.addLog('Enable', 'enable department succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });

  }

  disableData(data: Department) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'disable',
        title: 'Disable department',
        content: 'Department with disabled are not able to use',
        data_title: 'Department',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._departmentService.updateDataStatus(data, true).then(() => {
          this.snackBar.open('Disable department succeed', '', {duration: 3000});

          const new_data = new Department(data);
          new_data.disable = false;
          this.addLog('Disable', 'disable department succeed', new_data, data);

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
        (d.shortname && d.shortname.toLowerCase().indexOf(val) !== -1) ||
        (d.name1 && d.name1.toLowerCase().indexOf(val) !== -1) ||
        (d.name2 && d.name2.toLowerCase().indexOf(val) !== -1)
        || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  openLogs(data: Department) {
    this.dialog.open(LogsDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Department',
        path: this._departmentService.getPath(),
        ref: data ? data.code : null
      },
    });
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._departmentService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._departmentService.getPath(), log);
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
