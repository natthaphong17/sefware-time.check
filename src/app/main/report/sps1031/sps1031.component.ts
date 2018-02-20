import { Component, OnInit } from '@angular/core';
import {SetCompanyProfile} from '../../../setup/set-company-profile/set-company-profile';
import {PrintingService} from '../../../setup/check-time/printing-service.service';
import {MatDialog} from '@angular/material';
import {SetCompanyProfileService} from '../../../setup/set-company-profile/set-company-profile.service';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {EmployeeType} from '../../../setup/employee/employee-type';
import * as firebase from 'firebase';
import {AuthService} from '../../../login/auth.service';

@Component({
  selector: 'app-sps1031',
  templateUrl: './sps1031.component.html',
  styleUrls: ['./sps1031.component.scss'],
  providers: [SetCompanyProfileService, EmployeeTypeService, PrintingService]

})
export class Sps1031Component implements OnInit {

  data: SetCompanyProfile = new SetCompanyProfile({});
  employee = [];

  user: firebase.User;

  temp: any = [];

  constructor(private _companyService: SetCompanyProfileService,
              private _employeeService: EmployeeTypeService,
              private _authService: AuthService,
              private printingService: PrintingService,
              private dialog: MatDialog) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      this.load(snapshot[0].company_code);
      this.getEmployeeData();
    });
  }

  load(company_code) {
    this._companyService.requestDataByCode(company_code).subscribe((snapshot) => {
      const _row = new SetCompanyProfile(snapshot);
      this.data = _row;
    });
  }

  printReport(data) {
    this.temp = [];
    const newData = [];
    this.employee.forEach((s) => {
      const date = new Date(s.work_start_date);
      if (data.value.month !== undefined) {
        if (date.getFullYear().toString() === data.value.year && date.getMonth().toString() === data.value.month) {
          newData.push(s);
        }
      } else {
        if (date.getFullYear().toString() === data.value.year) {
          newData.push(s);
        }
      }
    });
    if (data.value.employee_start === undefined || data.value.employee_start === '') {
      data.value.employee_start = 0;
    }
    if (data.value.employee_end === undefined || data.value.employee_end === '') {
      data.value.employee_end = 9999999;
    }
    this.temp = newData.filter( (item) => item.code >= data.value.employee_start && item.code <= data.value.employee_end);
    if (this.temp.length <= 7) {
      this.setTempData();
    }
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
  }
  print() {
    const styles  = 'table {width: 100%;}' +
      'table, th, td {border: 1px solid black;border-collapse: collapse;}' +
      'th, td {padding: 5px;text-align: left;}' +
      'th {text-align: center;font-size: 14px;}' +
      'div {font-size: 14px;padding: 4px;}' +
      '.row {display: flex;}';
    this.printingService.print('sps1031', 'report', styles);
  }
  setTempData() {
    const i = 7 - this.temp.length;
    let a = 0;
    while (a < i) {
      a++;
      this.temp.push('');
    }
  }

  getEmployeeData() {
    this._employeeService.requestData().subscribe((snapshot) => {
      this._employeeService.rows = [];
      snapshot.forEach((s) => {
        const _row = new EmployeeType(s.val());
        if (_row.resing === 'green') {
          if (_row.company_code === this.data.code) {
            this._employeeService.rows.push(_row);
          }
        }
      });
      this.employee = [...this._employeeService.rows];
    });
  }
}
