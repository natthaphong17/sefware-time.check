import { Component, OnInit } from '@angular/core';
import {PrintingService} from '../../../setup/check-time/printing-service.service';
import {MatDialog} from '@angular/material';
import {SetCompanyProfileService} from '../../../setup/set-company-profile/set-company-profile.service';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {SetCompanyProfile} from '../../../setup/set-company-profile/set-company-profile';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {Payment} from '../../payrolls/management/payment/payment';
import {PaymentService} from '../../payrolls/management/payment/payment.service';
import {EmployeeType} from '../../../setup/employee/employee-type';
import * as firebase from 'firebase';
import {AuthService} from '../../../login/auth.service';

@Component({
  selector: 'app-sps110',
  templateUrl: './sps110.component.html',
  styleUrls: ['./sps110.component.scss'],
  providers: [SetCompanyProfileService, PrintingService, EmployeeTypeService, PaymentService]
})
export class Sps110Component implements OnInit {

  data: SetCompanyProfile = new SetCompanyProfile({});

  company: any = [];

  month: string = '';
  year: string = '';

  page1: any = [{
    sumAll: 0,
    employeeSumAll: 0,
    bossSumAll: 0,
    employeeAndBossSumAll: 0,
    employeeAll: 0,
  }];

  page2: any = [];

  page3: any = [{
    branchno : '',
    sumAll: 0,
    employeeSumAll: 0,
    bossSumAll: 0,
    employeeAndBossSumAll: 0,
    employeeAll: 0,
  }];

  payment: any = [];
  employee = [];

  temp: any = [];

  ratio: number = 3;

  user: firebase.User;

  constructor(private _companyService: SetCompanyProfileService,
              private _printingService: PrintingService,
              private dialog: MatDialog,
              private _authService: AuthService,
              private _employeeService: EmployeeTypeService,
              private _paymentService: PaymentService) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      this.getCompanyProfile(snapshot[0].company_code);
      this.getPaymentData();
      this.getEmployeeData();
    });
  }

  printReport(data) {
    // --------------------------set Data
    this.temp = [];
    this.page1 = [{
      sumAll: 0,
      employeeSumAll: 0,
      bossSumAll: 0,
      employeeAndBossSumAll: 0,
      employeeAll: 0,
    }];
    this.page2 = [];
    // -------------------------------- //
    this.getMonthAndYear(data.value.monthDate, data.value.year);
    // sum payment All employee
    const newData = [];
    this.employee.forEach((emp) => {
      const _row = new EmployeeType(emp);
      this.payment.forEach((pay) => {
        if (_row.code === pay.code) {
          const payDate = new Date(pay.payment_date);
          if (data.value.monthDate !== undefined) {
            if (payDate.getFullYear().toString() === data.value.year && payDate.getMonth().toString() === data.value.monthDate) {
              _row.date_payment = pay.payment_date;
              _row.total_payment = _row.total_payment + pay.total_income;
              const a = pay.provident_fund.toString();
              // tslint:disable-next-line:radix
              const b = parseInt(a);
              _row.total_deduction = _row.total_deduction + pay.total_deduction + b;
              // tslint:disable-next-line:radix
              emp.social_security_monthly_emp = _row.social_security_monthly_emp + parseInt(pay.social_security_monthly_emp);
              // tslint:disable-next-line:radix
              _row.social_security_monthly = _row.social_security_monthly + parseInt(pay.social_security_monthly);
            }
          } else {
            if (payDate.getFullYear().toString() === data.value.year) {
              _row.date_payment = pay.payment_date;
              _row.total_payment = _row.total_payment + pay.total_income;
              const a = pay.provident_fund.toString();
              // tslint:disable-next-line:radix
              const b = parseInt(a);
              _row.total_deduction = _row.total_deduction + pay.total_deduction + b;
              // tslint:disable-next-line:radix
              emp.social_security_monthly_emp = _row.social_security_monthly_emp + parseInt(pay.social_security_monthly_emp);
              // tslint:disable-next-line:radix
              _row.social_security_monthly = _row.social_security_monthly + parseInt(pay.social_security_monthly);
            }
          }
        }
      });
      newData.push(_row);
    });
    if (data.value.employee_start === undefined || data.value.employee_start === '') {
      data.value.employee_start = 0;
    }
    if (data.value.employee_end === undefined || data.value.employee_end === '') {
      data.value.employee_end = 9999999;
    }
    this.temp = newData.filter((item) => item.total_payment !== 0 && item.emp_code >= data.value.employee_start && item.emp_code <= data.value.employee_end);
    // sum Payment All
    this.temp.forEach((te) => {
      this.page1[0].sumAll = this.page1[0].sumAll + te.total_payment;
      this.page1[0].employeeSumAll = this.page1[0].employeeSumAll + te.social_security_monthly_emp;
      this.page1[0].bossSumAll = this.page1[0].bossSumAll + te.social_security_monthly;
    });
    this.page1[0].employeeAndBossSumAll = this.page1[0].sumAll + this.page1[0].employeeSumAll + this.page1[0].bossSumAll;
    this.page1[0].employeeAll = this.temp.length;
    // set data Page2 10 row
    this.setDataPage2();
    this.setDataPage3();
    // print report
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
    const style = 'body {\n' +
      '    font-size: 12px;\n' +
      '  }\n' +
      '  .row {\n' +
      '    display: flex;\n' +
      '  }\n' +
      '  .loc-md-1{\n' +
      '    width: 10%;\n' +
      '  }\n' +
      '  .loc-md-2{\n' +
      '    width: 20%;\n' +
      '  }\n' +
      '  .loc-md-3{\n' +
      '    width: 30%;\n' +
      '  }\n' +
      '  .loc-md-4{\n' +
      '    width: 50%;\n' +
      '  }\n' +
      '  .loc-md-5{\n' +
      '    width: 60%;\n' +
      '  }\n' +
      '  .loc-md-6{\n' +
      '    width: 60%;\n' +
      '  }\n' +
      '  .loc-md-7{\n' +
      '    width: 80%;\n' +
      '  }\n' +
      '  .loc-md-8{\n' +
      '    width: 90%;\n' +
      '  }\n' +
      '  .loc-md-9{\n' +
      '    width: 90%;\n' +
      '  }\n' +
      '  .loc-md-10{\n' +
      '    width: 100%;\n' +
      '  }\n' +
      '  .right {\n' +
      '    text-align: right;\n' +
      '  }\n' +
      '  .center {\n' +
      '    text-align: center;\n' +
      '  }\n' +
      '  .left {\n' +
      '    text-align: left;\n' +
      '  }\n' +
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
      '  }\n' +
      '  p {\n' +
      '    margin: 0px;\n' +
      '  }' +
      ' .pageBreak { ' +
      '   page-break-before: always; ' +
      '  }';
    this._printingService.print('sps110', 'report', style);
    this.getEmployeeData();
  }

  getCompanyProfile(company_code) {
    this._companyService.requestDataByCode(company_code).subscribe((snapshot) => {
      this.company = new SetCompanyProfile(snapshot);
    });
  }

  getMonthAndYear(month, year) {
    this.month = '';
    this.year = '';
    if (month !== undefined) {
      const monthName = [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม'];
      this.month = monthName[month];
      this.year = year;
    } else {
      this.month = '';
      this.year = year;
    }
  }

  getPaymentData() {
    this._paymentService.requestData().subscribe((snapshot) => {
      this._paymentService.rows = [];
      snapshot.forEach((s) => {
        const _row = new Payment(s.val());
        this._paymentService.rows.push(_row);
      });
      this.payment = [...this._paymentService.rows];
    });
  }

  getEmployeeData() {
    this._employeeService.requestData().subscribe((snapshot) => {
      this._employeeService.rows = [];
      snapshot.forEach((s) => {
        const _row = new EmployeeType(s.val());
        if (_row.resing === 'green') {
          if (_row.company_code === this.company.code) {
            this._employeeService.rows.push(_row);
          }
        }
      });
      this.employee = [...this._employeeService.rows];
    });
  }
  setDataPage2() {
    this.page2 = this.temp;
    if (this.page2.length <= 9) {
      let i = this.page2.length;
      while (i <= 9) {
        i++;
        this.page2.push('');
      }
    }
  }
  setDataPage3() {
    this.page3 = this.page1;
    this.page3[0].branchno = this.company.branchno;
    if (this.page3.length <= 9) {
      let i = this.page3.length;
      while (i <= 9) {
        i++;
        this.page3.push('');
      }
    }
  }
}
