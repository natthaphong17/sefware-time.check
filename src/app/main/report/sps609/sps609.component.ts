import { Component, OnInit } from '@angular/core';
import {SetCompanyProfile} from '../../../setup/set-company-profile/set-company-profile';
import {SetCompanyProfileService} from '../../../setup/set-company-profile/set-company-profile.service';
import {PrintingService} from '../../../setup/check-time/printing-service.service';
import {setStyles} from '@angular/animations/browser/src/util';
import {style} from '@angular/core/src/animation/dsl';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {MatDialog} from '@angular/material';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {EmployeeType} from '../../../setup/employee/employee-type';
import * as firebase from 'firebase';
import {AuthService} from '../../../login/auth.service';

@Component({
  selector: 'app-sps609',
  templateUrl: './sps609.component.html',
  styleUrls: ['./sps609.component.scss'],
  providers: [SetCompanyProfileService, PrintingService, EmployeeTypeService]
})
export class Sps609Component implements OnInit {

  data: SetCompanyProfile = new SetCompanyProfile({});

  employee = [];

  temp: any = [];

  ID: string = '';

  user: firebase.User;

  constructor(private _companyService: SetCompanyProfileService,
              private _printingService: PrintingService,
              private _authService: AuthService,
              private dialog: MatDialog,
              private _employeeService: EmployeeTypeService) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      this.load(snapshot[0].company_code);
      this.getEmployee();
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
    this.ID = data.value.month + (data.value.year + '');
    const newData = [];
    this.employee.forEach((s) => {
      const date = new Date(s.resing_date);
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
    this.temp = newData.filter( (item) => item.emp_code >= data.value.employee_start && item.emp_code <= data.value.employee_end);
    if (this.temp.length <= 7) {
      this.setEmployeeData();
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
    const styles  = 'body {\n' +
      '    font-size: 12px;\n' +
      '  }\n' +
      '\n' +
      '  div {\n' +
      '    padding: 1px;\n' +
      '  }\n' +
      '\n' +
      '  .row {\n' +
      '    display: flex;\n' +
      '  }\n' +
      '\n' +
      '  img {\n' +
      '    width: 100px;\n' +
      '    height: 100px;\n' +
      '  }\n' +
      '\n' +
      '  .left {\n' +
      '    text-align: left;\n' +
      '  }\n' +
      '\n' +
      '  .center {\n' +
      '    text-align: center;\n' +
      '  }\n' +
      '\n' +
      '  .right {\n' +
      '    text-align: right;\n' +
      '  }\n' +
      '\n' +
      '  table {\n' +
      '    width: 100%;\n' +
      '  }\n' +
      '\n' +
      '  table, th, td {\n' +
      '    border: 1px solid black;\n' +
      '    border-collapse: collapse;\n' +
      '  }\n' +
      '\n' +
      '  th, td {\n' +
      '    padding: 5px;\n' +
      '    text-align: left;}\n' +
      '\n' +
      '  th {\n' +
      '    text-align: center;\n' +
      '    font-size: 12px;\n' +
      '  }';
    this._printingService.print('sps609' + this.ID, 'report', styles);
  }

  setEmployeeData() {
    const i = 7 - this.temp.length;
    let a = 0;
    while (a < i) {
      a++;
      this.temp.push('');
    }
  }

  getEmployee() {
    this._employeeService.requestData().subscribe((snapshot) => {
      this._employeeService.rows = [];
      snapshot.forEach((s) => {
        const _row = new EmployeeType(s.val());
        if (_row.resing === 'red') {
          if (_row.company_code === this.data.code) {
            this._employeeService.rows.push(_row);
          }
        }
      });
      this.employee = [...this._employeeService.rows];
    });
  }

}
