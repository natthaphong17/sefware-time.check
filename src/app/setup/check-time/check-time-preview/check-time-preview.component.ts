import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {Language} from 'angular-l10n';
import {Page} from '../../../shared/model/page';
import {CheckTime} from '../check-time';
import {CheckTimeDialogComponent} from './check-time-dialog/check-time-dialog.component';
import {CheckTimeService} from '../check-time.service';
import {forEach} from '@angular/router/src/utils/collection';
import {PrintingService} from '../printing-service.service';

@Component({
  selector: 'app-check-time-preview',
  templateUrl: './check-time-preview.component.html',
  styleUrls: ['./check-time-preview.component.scss'],
  providers: [CheckTimeService, PrintingService]
})
export class CheckTimePreviewComponent implements OnInit {
  @Language() lang: string;

  loading: boolean = true;

  name: string = '-';
  path: string;
  ref: string;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];
  h = 0;
  m = 0;
  s = 0;
  timeGood = this.h + ':' + this.m + ':' + this.s;
  _h = 0;
  _m = 0;
  _s = 0;
  timeLate = this._h + ':' + this._m + ':' + this._s;
  __h = 0;
  __m = 0;
  __s = 0;
  timeGross = this.__h + ':' + this.__m + ':' + this.__s;
  statusGross = '';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: any,
              private dialog: MatDialog,
              private _checkTimeService: CheckTimeService,
              private printingService: PrintingService) {
    this.page.size = 10;
    this.page.pageNumber = 0;
    if (md_data) {
      this.name = this.md_data.name;
      this.path = this.md_data.path;
      this.ref = this.md_data.ref;
    }
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this._checkTimeService.requestDataByCode(this.ref).subscribe((snapshot) => {
      this._checkTimeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new CheckTime(s.val());
        this._checkTimeService.rows.push(_row);

        this.sumResult(s.val().check_in_result, s.val().check_in_status, s.val().check_out_result, s.val().check_out_status);

      });
      this._checkTimeService.rows.reverse();
      this.temp = [...this._checkTimeService.rows];
      this.sumGross();
      this.loading = false;
      this.setPage(null);
    });

  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._checkTimeService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }
  sumResult(checkIn, checkInStatus, checkOut, checkOutStatus) {
    if (checkInStatus === 'Good') {
      this.sumGood(checkIn);
    } else if (checkInStatus === 'Non Pay' || checkInStatus === 'Warning' || checkInStatus === 'Warning-Good') {
      this.sumLate(checkIn);
    }
    if (checkOutStatus === 'Good') {
      this.sumGood(checkOut);
    } else if (checkOutStatus === 'Non Pay' || checkOutStatus === 'Warning' || checkOutStatus === 'Warning-Good') {
      this.sumLate(checkOut);
    }
  }
  sumGood(time) {
    // tslint:disable-next-line:radix
    const _checkIdH = parseInt(time.substring(0, 2));
    // tslint:disable-next-line:radix
    const _checkIdM = parseInt(time.substring(3, 5));
    // tslint:disable-next-line:radix
    const _checkIdS = parseInt(time.substring(6, 8));
    this.s = this.s + _checkIdS;
    this.m = this.m + _checkIdM;
    this.h = this.h + _checkIdH;
    if (this.s > 59) {
      while (this.s > 59) {
        this.m = this.m + 1;
        this.s = this.s - 60;
      }
    }
    if (this.m > 59) {
      while (this.m > 59) {
        this.h = this.h + 1;
        this.m = this.m - 60;
      }
    }
    this.timeGood = this.h + ':' + this.m + ':' + this.s;
  }
  sumLate(time) {
    // tslint:disable-next-line:radix
    const _checkIdH = parseInt(time.substring(0, 2));
    // tslint:disable-next-line:radix
    const _checkIdM = parseInt(time.substring(3, 5));
    // tslint:disable-next-line:radix
    const _checkIdS = parseInt(time.substring(6, 8));
    this._s = this._s + _checkIdS;
    this._m = this._m + _checkIdM;
    this._h = this._h + _checkIdH;
    if (this.s > 59) {
      while (this._s > 59) {
        this._m = this._m + 1;
        this._s = this._s - 60;
      }
    }
    if (this._m > 59) {
      while (this._m > 59) {
        this._h = this._h + 1;
        this._m = this._m - 60;
      }
    }
    this.timeLate = this._h + ':' + this._m + ':' + this._s;
  }
  sumGross() {
    if (this.h >= this._h) {
      this.__h = this.h - this._h;
      this.statusGross = '#1B5E20';
    } else {
      this.__h = this._h - this.h;
      this.statusGross = '#B71C1C';
    }
    if (this.m > this._m) {
      this.__m = this.m - this._m;
    } else {
      this.__m = this._m - this.m;
    }
    if (this.s > this._s) {
      this.__s = this.s - this._s;
    } else {
      this.__s = this._s - this.s;
    }
    this.timeGross = this.__h + ':' + this.__m + ':' + this.__s;
  }
  previewPrint(name: string) {
    const styles  = 'table {border-collapse: collapse;width: 90%;} ' +
      'th, td {text-align: left;padding: 8px;} ' +
      'tr:nth-child(even){background-color: #f2f2f2} ' +
      'label {padding: 0 15px;font-size: 20px;}';
    this.printingService.print(name, 'report', styles);
  }
}
