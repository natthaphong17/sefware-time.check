import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Language} from 'angular-l10n';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../../shared/model/page';
import {TdMediaService} from '@covalent/core';
import {LogsService} from '../../../dialog/logs-dialog/logs.service';
import {Logs} from '../../../dialog/logs-dialog/logs';
import {LogsDialogComponent} from '../../../dialog/logs-dialog/logs-dialog.component';
import {ManagementService} from './management.service';
import {Management, TakeLeave} from './management';
import {PaymentComponent} from './payment/payment.component';
import {__await} from 'tslib';
import {echo, test} from 'shelljs';
import {Payment} from './payment/payment';
import {NewPaymentsComponent} from './new-payments/new-payments.component';
import {PaymentService} from './payment/payment.service';
import {ResingComponent} from './resing/resing.component';
import {Resing} from './resing/resing';
import {UndoComponent} from './undo/undo.component';
import * as firebase from 'firebase';
import { version as appVersion } from '../../../../../package.json';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {AuthService} from '../../../login/auth.service';
import {EmployeeType} from '../../../setup/employee/employee-type';

@Component({
  selector: 'app-payrolls-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
  providers: [ManagementService, PaymentService, EmployeeTypeService, AuthService]
})
export class ManagementComponent implements OnInit, AfterViewInit {

  @Language() lang: string;
  @ViewChild('dataTable') table: any;
  public appVersion;
  user: firebase.User;
  company_check = '';

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};
  rows: any[] = [];
  temp = [];
  test = [];
  take_leave = [];
  take_leave_data = [];
  year_now = new Date();
  chack_pay_status: number = 0;
  count_row: number = 0;

  constructor(private _managementService: ManagementService,
              private _employeetypeService: EmployeeTypeService,
              private _authService: AuthService,
              private _paymentService: PaymentService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _logService: LogsService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;
    this.page.size = 50;
    this.page.pageNumber = 0;

  }

  ngOnInit(): void {
    this.setEmployee();
    // this.loadTakeLeaveData();
  }

  ngAfterViewInit(): void {
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  load() {
    this.loading = true;
    this._managementService.requestData().subscribe((snapshot) => {
      this._managementService.rows = [];
      snapshot.forEach((s) => {
        const _row = new Management(s.val());
        this._managementService.requestTakeLeaveData(s.val().code).subscribe((take_leave) => {
          take_leave.forEach((leave) => {
            // console.log('Lsifdffssfs: ' + leave.end_leave);
            // let cal_date_leave: number = 0;
            const start = new Date(leave.start_leave);
            const end = new Date(leave.end_leave);
            const end_year = new Date(this.year_now.getFullYear() + '-12-31T00:17:00.000Z');
            const start_year = new Date(this.year_now.getFullYear() + '-01-01T00:00:00.000Z');
            // console.log(start_year);
            // cal_date_leave = (end.getDate() - start.getDate()) + 1;
            if (start.getFullYear() === this.year_now.getFullYear()) {
              if (leave.take_leave_status === 'Approve') {
                // Sick Leave Start Date Chack
                  if (leave.take_leave === 'Sick Leave') {
                    if (start.getMonth() + 1 === 12) {
                      if (start.getDate() === 31) {
                        _row.sick_leave = _row.sick_leave + 1;
                      } else {
                        _row.sick_leave = _row.sick_leave + ((31 - start.getDate()) + 1);
                      }
                    } else if (start.getMonth() + 1 === 11) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 10) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 9) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 8) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 7) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 6) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 5) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 4) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 3) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 2) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 1) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.sick_leave = _row.sick_leave + this.chackDate(start, end);
                      } else {
                        _row.sick_leave = _row.sick_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }
                    // Business Leave Start Date Chack
                } else if (leave.take_leave === 'Business Leave') {
                    if (start.getMonth() + 1 === 12) {
                      if (start.getDate() === 31) {
                        _row.bussiness_leave = _row.bussiness_leave + 1;
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + ((31 - start.getDate()) + 1);
                      }
                    } else if (start.getMonth() + 1 === 11) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 10) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 9) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 8) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 7) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 6) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 5) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 4) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 3) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 2) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 1) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDate(start, end);
                      } else {
                        _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnEndYear(end_year, start);
                      }
                    }
                    // Holidays Start Date Chack
                } else if (leave.take_leave === 'Holidays') {
                    if (start.getMonth() + 1 === 12) {
                      if (start.getDate() === 31) {
                        _row.holiday = _row.holiday + 1;
                      } else {
                        _row.holiday = _row.holiday + ((31 - start.getDate()) + 1);
                      }
                    } else if (start.getMonth() + 1 === 11) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 10) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 9) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 8) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 7) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 6) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 5) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 4) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 3) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 2) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 1) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.holiday = _row.holiday + this.chackDate(start, end);
                      } else {
                        _row.holiday = _row.holiday + this.chackDateOnEndYear(end_year, start);
                      }
                    }
                    // Vacations Start Date Chack
                } else if (leave.take_leave === 'Vacations') {
                    if (start.getMonth() + 1 === 12) {
                      if (start.getDate() === 31) {
                        _row.vacation = _row.vacation + 1;
                      } else {
                        _row.vacation = _row.vacation + ((31 - start.getDate()) + 1);
                      }
                    } else if (start.getMonth() + 1 === 11) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 10) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 9) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 8) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 7) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 6) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 5) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 4) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 3) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 2) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }else if (start.getMonth() + 1 === 1) {
                      if (end.getFullYear() === this.year_now.getFullYear()) {
                        _row.vacation = _row.vacation + this.chackDate(start, end);
                      } else {
                        _row.vacation = _row.vacation + this.chackDateOnEndYear(end_year, start);
                      }
                    }
                }
              }
              // Chack End Date On This Year
            } else {
              if (end.getFullYear() === this.year_now.getFullYear()) {
                if (leave.take_leave_status === 'Approve') {
                  if (leave.take_leave === 'Sick Leave') {
                    _row.sick_leave = _row.sick_leave + this.chackDateOnStartYear(start_year, end);
                  } else if (leave.bussiness_leave === 'Business Leave') {
                    _row.bussiness_leave = _row.bussiness_leave + this.chackDateOnStartYear(start_year, end);
                  } else if (leave.holiday === 'Holidays') {
                    _row.holiday = _row.holiday + this.chackDateOnStartYear(start_year, end);
                  } else if (leave.vacation === 'Vacations') {
                    _row.vacation = _row.vacation + this.chackDateOnStartYear(start_year, end);
                  }
                }
              }
            }
          });
          if (_row.company_code === this.company_check) {
            if (_row.resing === 'green') {
              if (_row.pay_status !== 'paid') {
                this._managementService.rows.push(_row);
              }
            }
            this.returnRowsData();
          }
          // console.log(' _row : ' +  JSON.stringify(_row));
        });
      });
    });

    this._managementService.rows.reverse();
    this.temp = [...this._managementService.rows];
    // console.log(' this.temp : ' +  JSON.stringify(this.temp));
    // console.log('test1 ..... ');
    this.loading = false;
    this.setPage(null);
  }

  chackDate(start, end) {
    const data1 = new Date(start);
    const data2 = new Date(end);
    const date = data2.getTime() - data1.getTime();

    const days = Math.floor(date / (60 * 60 * 24 * 1000));
    return (days + 1);
  }

  // print() {
  //   window.print();
  // }

  chackDateOnEndYear(end_year, start) {
    const data1 = new Date(end_year);
    const data2 = new Date(start);
    const date = data1.getTime() - data2.getTime();

    const days = Math.floor(date / (60 * 60 * 24 * 1000));
    return (days + 2);
  }

  chackDateOnStartYear(start_year, end) {
    const data1 = new Date(start_year);
    const data2 = new Date(end);
    const date = data2.getTime() - data1.getTime();
    const days = Math.floor(date / (60 * 60 * 24 * 1000));
    return (days + 1);
  }

  newPayments() {
    const dialogRef = this.dialog.open(NewPaymentsComponent, {
      disableClose: true,
      width: '60%',
      height: '40%'
    });
  }

  // updateStatus() {
  //   this._managementService.requestEmployeeData().subscribe((emp) => {
  //     emp.forEach((e) => {
  //       this._managementService.updatePayStatus(e.val());
  //     });
  //   });
  // }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._managementService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  editData(data: Management) {
    /*const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '100%',
      height: '100%',
      data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.addLog('Update', 'update driver succeed', result, data);
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });*/
  }

  deleteData(data: Management) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete comparison',
        content: 'Confirm to delete?',
        data_title: 'Comparison',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._managementService.removeData(data).then(() => {
          this.snackBar.open('Delete comparison succeed', '', {duration: 3000});
          this.addLog('Delete', 'delete comparison succeed', data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  enableData(data: Management) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'enable',
        title: 'Enable comparison',
        content: 'Comparison with enabled will be able to use',
        data_title: 'Comparison',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._managementService.updateDataStatus(data, false).then(() => {
          this.snackBar.open('Enable comparison succeed', '', {duration: 3000});

          const new_data = new Management(data);
          // new_data.disable = false;
          this.addLog('Enable', 'enable comparison succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });

  }

  disableData(data: Management) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'disable',
        title: 'Disable comparison',
        content: 'Comparison with disabled are not able to use',
        data_title: 'Comparison',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._managementService.updateDataStatus(data, true).then(() => {
          this.snackBar.open('Disable comparison succeed', '', {duration: 3000});

          const new_data = new Management(data);
          // new_data.disable = false;
          this.addLog('Disable', 'Disable comparison succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  openLogs(data: Management) {
    this.dialog.open(LogsDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Comparison',
        path: this._managementService.getPath(),
        ref: data ? data.code : null
      },
    });
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._managementService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._managementService.getPath(), log);
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
        (d.name && d.name.toLowerCase().indexOf(val) !== -1)
        || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  returnRowsData() {
    this.temp = [...this._managementService.rows];
    this.count_row = this.temp.length;
    // console.log(' this.temp : ' +  this.temp.length);
    // console.log(' this.temp : ' +  JSON.stringify(this.temp));
    // console.log('test211 ..... ');
    this.loading = false;
    this.setPage(null);
  }

  resingData(data: Management) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'confirm',
        title: 'Resign employee',
        content: 'Confirm to resign?',
        data_title: 'Resign Employee',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        const data1 = { code : data.code , resing : 'red' , resing_date : new Date(), pay_status : 'wait', save_status : 'no'};
        this._managementService.updateData(data1 as Management).then(() => {
          this.snackBar.open('Resign employee succeed.', '', {duration: 3000});
          this.addLog('Resign', 'resihn employee succeed', data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  addPayment(data: Payment) {
    const dialogRef = this.dialog.open(PaymentComponent, {
      disableClose: true,
      width: '70%',
      height: '90%',
      data
    });
  }

  undo() {
    const dialogRef = this.dialog.open(UndoComponent, {
      disableClose: true,
      width: '60%',
      height: '90%'
    });
  }

  setEmployee() {
    this._employeetypeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _employeedata = new EmployeeType(snapshot[0]);
      this.company_check = _employeedata.company_code;
      this.load();
    });
  }
}
