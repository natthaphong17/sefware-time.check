import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Language} from 'angular-l10n';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../../shared/model/page';
import {TdMediaService} from '@covalent/core';
import {LogsService} from '../../../dialog/logs-dialog/logs.service';
import {Logs} from '../../../dialog/logs-dialog/logs';
import {LogsDialogComponent} from '../../../dialog/logs-dialog/logs-dialog.component';
import { TakeLeaveService } from './take-leave.service';
import {TakeLeave} from './take-leave';
import {SickLeaveDialogComponent} from './sick-leave-dialog/sick-leave-dialog.component';
import {AddTakeLeaveDialogComponent} from './add-take-leave-dialog/add-take-leave-dialog.component';
import {echo} from 'shelljs';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import * as firebase from 'firebase';
import {AuthService} from '../../../login/auth.service';
import {EmployeeType} from '../../../setup/employee/employee-type';
import { version as appVersion } from '../../../../../package.json';

@Component({
  selector: 'app-payrolls-take-leave',
  templateUrl: './take-leave.component.html',
  styleUrls: ['./take-leave.component.scss'],
  providers: [TakeLeaveService, EmployeeTypeService, AuthService]
})
export class TakeLeaveComponent implements OnInit, AfterViewInit {

  @Language() lang: string;
  @ViewChild('dataTable') table: any;
  public appVersion;
  user: firebase.User;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  company_check = '';
  rows: any[] = [];
  temp = [];

  status = false;
  status_add_btn = true;
  status_del_row = false;
  level = '-';
  emp_code_chack = '-';

  employee_code: string = '';
  employee_name: string = '';
  department: string = '';
  constructor(private _takeleaveService: TakeLeaveService,
              private _changeDetectorRef: ChangeDetectorRef,
              public _authService: AuthService,
              private _employeeService: EmployeeTypeService,
              private _logService: LogsService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });

    this.page.size = 50;
    this.page.pageNumber = 0;

  }

  ngOnInit(): void {
    this.setEmployee();
    this.setEmployeeChack();
    this.setEmployeeToAdd();
  }

  ngAfterViewInit(): void {
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  load() {
    this.loading = true;
    this._takeleaveService.requestData().subscribe((snapshot) => {
      this._takeleaveService.rows = [];
      snapshot.forEach((s) => {

        const _row = new TakeLeave(s.val());
        if (this.level === '0') {
          this._takeleaveService.rows.push(_row);
        } else {
          if (this.level === '1' || this.level === '2') {
            if (_row.company_code === this.company_check) {
              this._takeleaveService.rows.push(_row);
            }
          } else {
            if (this.level === '3') {
              if (this.emp_code_chack === _row.employee_code) {
                this._takeleaveService.rows.push(_row);
              }
            }
          }
        }
      });
      // Function Revert Row
      this._takeleaveService.rows.reverse();
      this.temp = [...this._takeleaveService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._takeleaveService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData(employee_code, employee_name, department) {
    console.log('department : ' + department);
    const dialogRef = this.dialog.open(AddTakeLeaveDialogComponent, {
      disableClose: true,
      width: '60%',
      height: '40%',
      data: {
        employee_code,
        employee_name,
        department
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.addLog('Create', 'create driver succeed', result, {});
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  deleteData(data: TakeLeave) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete Take Leave',
        content: 'Confirm to delete?',
        data_title: 'Take Leave',
        data: data.code + ' : ' + data.employee_name
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._takeleaveService.removeData(data).then(() => {
          this.snackBar.open('Delete take leave succeed', '', {duration: 3000});
          this.addLog('Delete', 'delete take leave succeed', data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  enableData(data: TakeLeave) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'enable',
        title: 'Enable take leave',
        content: 'take leave with enabled will be able to use',
        data_title: 'take leave',
        data: data.code + ' : ' + data.employee_name
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._takeleaveService.updateDataStatus(data, false).then(() => {
          this.snackBar.open('Enable take leave succeed', '', {duration: 3000});

          const new_data = new TakeLeave(data);
          // new_data.disable = false;
          this.addLog('Enable', 'enable take leave succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });

  }

  disableData(data: TakeLeave) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'disable',
        title: 'Disable take leave',
        content: 'take leave with disabled are not able to use',
        data_title: 'take leave',
        data: data.code + ' : ' + data.employee_name
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._takeleaveService.updateDataStatus(data, true).then(() => {
          this.snackBar.open('Disable take leave succeed', '', {duration: 3000});

          const new_data = new TakeLeave(data);
          // new_data.disable = false;
          this.addLog('Disable', 'Disable take leave succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  openLogs(data: TakeLeave) {
    this.dialog.open(LogsDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Take leave',
        path: this._takeleaveService.getPath(),
        ref: data ? data.code : null
      },
    });
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._takeleaveService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._takeleaveService.getPath(), log);
  }

  updateFilter(event) {
    if (event === '') {
      this.setPage(null);
      return;
    }

    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return (d.take_leave_status.toLowerCase().indexOf(val) !== -1)
        // (d.take_leave_status && d.take_leave_status.toLowerCase().indexOf(val) === -1)
        || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  updateData(data) {
    // console.log('=================' + data);
    this._takeleaveService.updateData(data);
  }

  cancelStatus(data) {
    data.take_leave_status = 'Cancel';
    data.status_colos = '#F44336';
    data.disable = true;
    this._takeleaveService.updateData(data);
  }

  approveStatus(data) {
    data.take_leave_status = 'Approve';
    data.status_colos = '#4CAF50';
    data.disable = true;
    this._takeleaveService.updateData(data);
  }

  setEmployee() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _row = new EmployeeType(snapshot[0]);
      if (_row.level === '1' || _row.level === '2') {
        this.status = true;
      } else {
        this.status = false;
      }
      if (_row.level === '2' || _row.level === '3') {
        this.status_add_btn = true;
        this.status_del_row = false;
      } else if (_row.level === '0' || _row.level === '1') {
        this.status_add_btn = false;
        this.status_del_row = true;
      }
    });
  }

  setEmployeeToAdd() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _row = new EmployeeType(snapshot[0]);
      this.employee_code = _row.code;
      this.employee_name = _row.name1;
      this.department = _row.department;
    });
  }

  setEmployeeChack() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _employeedata = new EmployeeType(snapshot[0]);
      this.company_check = _employeedata.company_code;
      this.level = _employeedata.level;
      this.emp_code_chack = _employeedata.code;
      this.load();
    });
  }
}
