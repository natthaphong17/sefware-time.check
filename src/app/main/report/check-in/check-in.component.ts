import { Component, OnInit } from '@angular/core';
import { CheckTimeService } from '../../../setup/check-time/check-time.service';
import { PrintingService } from '../../../setup/check-time/printing-service.service';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '../../../dialog/confirm/confirm.component';
import {AuthService} from '../../../login/auth.service';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss'],
  providers: [CheckTimeService, PrintingService]

})
export class CheckInComponent implements OnInit {

  loading: boolean = true;

  month = [];

  checkInInYear = [];

  printPage: number = 0;

  name = '';
  company = '';

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

  constructor(private _authService: AuthService,
              private _employeeService: EmployeeTypeService,
              private _checkInService: CheckTimeService,
              private dialog: MatDialog,
              private _printingService: PrintingService) {
    this._authService.user.subscribe((user) => {
      this.getEmployeeName(user.email);
    });
  }

  ngOnInit() {
    this.getMonth();
    this.loading = false;
  }

  printReport(from) {
    this.checkInInYear = [];
    this._employeeService.requestDataByCode(this.company + '-' + from.value.employee_code).subscribe((s) => {
      this.name = s.name2;
    });
    this._checkInService.requestByMonthTomMonth({
      startMonth: from.value.month_start,
      endMonth: from.value.month_end,
      year: from.value.year,
      employeeCode: this.company + '-' + from.value.employee_code
    }).subscribe((item) => {
      let newCheckInOnMonth = [];
      let i = 0;
      item.forEach((row) => {
        const date = new Date(row.val().date);
        i++;
        if (newCheckInOnMonth.length >= 1) {
          if (new Date (newCheckInOnMonth[0].date).getMonth() !== date.getMonth()) {
            this.sumGross();
            const array = {
              timeGood: this.timeGood,
              timeLate: this.timeLate,
              timeGross: this.timeGross,
              dataCheckIn: newCheckInOnMonth
            };
            this.checkInInYear.push(array);
            this.setZero();
            newCheckInOnMonth = [];
          }
        }
        this.sumResult(row.val());
        newCheckInOnMonth.push(row.val());
        if (item.length === i) {
          if (newCheckInOnMonth.length !== 0) {
            this.sumGross();
            const array = {
              timeGood: this.timeGood,
              timeLate: this.timeLate,
              timeGross: this.timeGross,
              dataCheckIn: newCheckInOnMonth
            };
            this.checkInInYear.push(array);
            this.setZero();
            newCheckInOnMonth = [];
          }
        }
      });
      this.printPage = this.checkInInYear.length;
      this.dialog.open(ConfirmComponent, {
        data: {
          type: 'confirm',
          title: 'Print',
          content: 'Confirm to Print ?',
          data_title: 'Print !',
          data: ''
        }
      }).afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.print();
        }
      });
    });
  }

  setZero() {
    this.h = 0;
    this.m = 0;
    this.s = 0;
    this.timeGood = this.h + ':' + this.m + ':' + this.s;
    this._h = 0;
    this._m = 0;
    this._s = 0;
    this.timeLate = this._h + ':' + this._m + ':' + this._s;
    this.__h = 0;
    this.__m = 0;
    this.__s = 0;
    this.timeGross = this.__h + ':' + this.__m + ':' + this.__s;
  }

  sumResult(data) {
    if (data.check_in_status === 'Good') {
      this.sumGood(data.check_in_result);
    } else if (data.check_in_status === 'Non Pay' || data.check_in_status === 'Warning' || data.check_in_status === 'Warning-Good') {
      this.sumLate(data.check_in_result);
    }
    if (data.check_out_status === 'Good') {
      this.sumGood(data.check_out_result);
    } else if (data.check_out_status === 'Non Pay' || data.check_out_status === 'Warning' || data.check_out_status === 'Warning-Good') {
      this.sumLate(data.check_out_result);
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
    } else {
      this.__h = this._h - this.h;
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

  getMonth() {
    this.month = [];
    let i = 0;
    while (i < 12) {
      i++;
      let x = '';
      if (i < 10) {
        x = '0';
      }
      this.month.push({id: x + i, value: x + i});
    }
  }

  print() {
    const style = '.pageBreak {page-break-before: always;}' +
      'table {border-collapse: collapse;width: 90%;}' +
      'th, td {text-align: left;padding: 8px;}' +
      'tr:nth-child(even){background-color: #f2f2f2}' +
      'label {padding: 0 15px;font-size: 20px;}';
    this._printingService.print('check-in', 'report', style);
  }

  getEmployeeName(email) {
    this._employeeService.requestDataByEmail(email).subscribe((snapshot) => {
      this.company = snapshot[0].company_code;
    });
  }

}
