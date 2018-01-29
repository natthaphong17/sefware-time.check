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

@Component({
  selector: 'app-check-time',
  templateUrl: './check-time.component.html',
  styleUrls: ['./check-time.component.scss'],
  providers: [EmployeeTypeService, LogsService, CheckTimeService]
})
export class CheckTimeComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private dialog: MatDialog,
              public snackBar: MatSnackBar,
              private _logService: LogsService,
              private _employeeService: EmployeeTypeService,
              private _checkTimeService: CheckTimeService) {
    this.page.size = 10;
    this.page.pageNumber = 0; }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this._employeeService.requestData().subscribe((snapshot) => {
      this._employeeService.rows = [];
      snapshot.forEach((s) => {
        let i = 0;
        let f = 0;
        let g = 0;

        const _row = new EmployeeType(s.val());
        this._checkTimeService.requestDataByCode(s.val().code).subscribe((snapshotTime) => {
          snapshotTime.forEach((s1) => {
            if (s1.val().check_in_status === 'improve') {
              i = i + 1;
            }
            if (s1.val().check_out_status === 'improve') {
              i = i + 1;
            }
            if (s1.val().check_in_status === 'fire') {
              f = f + 1;
            }
            if (s1.val().check_out_status === 'fire') {
              f = f + 1;
            }
            if (s1.val().check_in_status === 'good') {
              g = g + 1;
            }
            if (s1.val().check_out_status === 'good') {
              g = g + 1;
            }
          });
          console.log('i :' + i);
          if (i >= 3) {
            _row.statusTime = 'Improve';
            console.log('Improve');
          } else if (f >= 3) {
            _row.statusTime = 'Fire';
            console.log('Fire');
          } else {
            _row.statusTime = 'Good';
            console.log('Good');
          }
          this._employeeService.rows.push(_row);
          this.setStatus();
        });

      });

      this.temp = [...this._employeeService.rows];
      this.loading = false;
      this.setPage(null);
    });

  }

  setStatus() {
    this.temp = [...this._employeeService.rows];
    this.loading = false;
    this.setPage(null);  }

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
      width: '25%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }
}
