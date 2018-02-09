import {Component, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../shared/model/page';
import {Language} from 'angular-l10n';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LogsService} from '../../dialog/logs-dialog/logs.service';
import {CheckTimePreviewComponent} from './check-time-preview/check-time-preview.component';
import {EmployeeTypeService} from '../employee/employee-type.service';
import {EmployeeType} from '../employee/employee-type';
import {CheckInComponent} from './check-in/check-in.component';
import {CheckOutComponent} from './check-out/check-out.component';
import {CheckTime} from './check-time';
import {CheckTimeService} from './check-time.service';
import {CheckInOut} from './check-in-out';
import {WorkingtimesettingTypeService} from '../workingtimesetting/workingtimesetting-type.service';

@Component({
  selector: 'app-check-time',
  templateUrl: './check-time.component.html',
  styleUrls: ['./check-time.component.scss'],
  providers: [EmployeeTypeService, LogsService, CheckTimeService, CheckInOut, WorkingtimesettingTypeService]
})
export class CheckTimeComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  data: CheckTime = new CheckTime({});

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];
  checkTime = [];

  constructor(private dialog: MatDialog,
              public snackBar: MatSnackBar,
              private _logService: LogsService,
              private _employeeService: EmployeeTypeService,
              private _checkTimeService: CheckTimeService,
              private _checkInOut: CheckInOut) {
    this._checkInOut.load();
    this.page.size = 10;
    this.page.pageNumber = 0; }

  ngOnInit() {
    this.load();
  }

  load() {
    this.getCheckTime();
    this.loading = true;
    this._employeeService.requestData().subscribe((snapshot) => {
      this._employeeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new EmployeeType(s.val());
        if (_row.resing === 'green') {
          _row.statusTime = this.checkInOutTime(s.val().code);
          this._employeeService.rows.push(_row);
        }
      });

      this.temp = [...this._employeeService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }
  checkInOutTime(code) {
    let i = 0;
    let f = 0;
    let g = 0;

    let result = '';
    const nowDate = new Date();
    this.checkTime.forEach((s) => {
      const date = new Date(s.date);
      if (nowDate.getFullYear() === date.getFullYear()) {
        if (nowDate.getMonth() === date.getMonth()) {
          if (s.employee_code === code) {
            if (s.check_in_status === 'Non Pay') {
              i = i + 1;
            }
            if (s.check_out_status === 'Non Pay') {
              i = i + 1;
            }
            if (s.check_in_status === 'Non Pay') {
              f = f + 1;
            }
            if (s.check_out_status === 'Non Pay') {
              f = f + 1;
            }
            if (s.check_in_status === 'Warning') {
              f = f + 1;
            }
            if (s.check_out_status === 'Warning') {
              f = f + 1;
            }
            if (s.check_in_status === 'Warning-Good') {
              g = g + 1;
            }
            if (s.check_out_status === 'Warning-Good') {
              g = g + 1;
            }
            if (s.check_in_status === 'Good') {
              g = g + 1;
            }
            if (s.check_out_status === 'Good') {
              g = g + 1;
            }
          }
        }
      }
    });
    if (i >= 3) {
      result = 'Improve';
    } else if (f >= 3) {
      result = 'Fire';
    } else {
      result = 'Good';
    }
    return result;
  }
  getCheckTime() {
    this.checkTime = [];
    this._checkTimeService.requestData().subscribe((snapshot) => {
      snapshot.forEach((s) => {
        const _row = new CheckTime(s.val());
        this.checkTime.push(_row);
      });
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._employeeService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }
  openWorkingTimePreview(data: EmployeeType) {
    this.dialog.open(CheckTimePreviewComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        name: data.name1,
        path: this._employeeService.getPath(),
        ref: data ? data.code : null
      },
    });
  }
  checkIn() {
    const dialogRef = this.dialog.open(CheckInComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '30%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }
  refresh() {
    this.load();
  }
}
