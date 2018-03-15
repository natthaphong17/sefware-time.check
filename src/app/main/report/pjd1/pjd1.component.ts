import { Component, OnInit } from '@angular/core';
import {SetCompanyProfile} from '../../../setup/set-company-profile/set-company-profile';
import {SetCompanyProfileService} from '../../../setup/set-company-profile/set-company-profile.service';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {PrintingService} from '../../../setup/check-time/printing-service.service';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {MatDialog} from '@angular/material';
import {PaymentService} from '../../payrolls/management/payment/payment.service';
import {Payment} from '../../payrolls/management/payment/payment';
import {EmployeeType} from '../../../setup/employee/employee-type';
import * as firebase from 'firebase';
import {AuthService} from '../../../login/auth.service';

@Component({
  selector: 'app-pjd1',
  templateUrl: './pjd1.component.html',
  styleUrls: ['./pjd1.component.scss'],
  providers: [SetCompanyProfileService, PaymentService, PrintingService, EmployeeTypeService]
})
export class Pjd1Component implements OnInit {

  data: SetCompanyProfile = new SetCompanyProfile({});

  employee = [];
  payment = [];

  datePrint = '';

  temp = [];

  user: firebase.User;

  constructor(private _companyService: SetCompanyProfileService,
              private _paymentService: PaymentService,
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
      this.load2(snapshot[0].company_code);
      this.getEmployeeData(snapshot[0].company_code);
    });
    this.setDatePrint();
    this.getPaymentData();
  }

  load2(company_code) {
    this._companyService.requestDataByCode(company_code).subscribe((snapshot) => {
      const _row = new SetCompanyProfile(snapshot);
      this.data = _row;
    });
  }

  printReport(data) {
    console.log(this.data);
    this.temp = [];
    this.employee.forEach((emp) => {
      this.payment.forEach((pay) => {
        if (emp.code === pay.code) {
          const payDate = new Date(pay.period);
          if (payDate.getFullYear().toString() === data.value.year) {
            if (data.value.month !== undefined) {
              // กำหนดเดือน
              if (payDate.getMonth().toString() === data.value.month) {
                emp.date_payment = pay.payment_date;
                emp.total_payment = emp.total_payment + pay.total_income;
                const a = pay.provident_fund.toString();
                // tslint:disable-next-line:radix
                const b = parseInt(a);
                emp.total_deduction = emp.total_deduction + pay.total_deduction + b;
              }
            } else {
              emp.date_payment = pay.payment_date;
              emp.total_payment = emp.total_payment + pay.total_income;
              const a = pay.provident_fund.toString();
              // tslint:disable-next-line:radix
              const b = parseInt(a);
              emp.total_deduction = emp.total_deduction + pay.total_deduction + b;
            }
          }
        }
      });
    });
    if (data.value.employee_start === undefined || data.value.employee_start === '') {
      data.value.employee_start = 0;
    }
    if (data.value.employee_end === undefined || data.value.employee_end === '') {
      data.value.employee_end = 9999999;
    }
    this.temp = this.employee.filter((item) => item.total_payment !== 0 && item.emp_code >= data.value.employee_start && item.emp_code <= data.value.employee_end);
    if (this.temp.length <= 8) {
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
    const styles  = 'body {\n' +
      '    font-size: 14px;\n' +
      '  }\n' +
      '  div {\n' +
      '    /*border: 1px solid black;*/\n' +
      '    padding: 1px;\n' +
      '  }\n' +
      '  .row {\n' +
      '    display: flex;\n' +
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
      '  .redBox {\n' +
      '    text-align: center;\n' +
      '    padding: 5px;\n' +
      '    border: 5px solid red;\n' +
      '    color: red;\n' +
      '    background: #6d6d6d;\n' +
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
      '  td {\n' +
      '    text-align: left;\n' +
      '    font-size: 10px;\n' +
      '  }\n' +
      '  .verticalText {\n' +
      '    -webkit-transform: rotate(-90deg);\n' +
      '    -moz-transform: rotate(-90deg);\n' +
      '  }';
    this.printingService.print('pjd1', 'report', styles);
    this.getEmployeeData(this.data.code);
  }

  setTempData() {
    const i = 8 - this.temp.length;
    let a = 0;
    while (a < i) {
      a++;
      this.temp.push('');
    }
  }

  getEmployeeData(company_code) {
    this._employeeService.requestData().subscribe((snapshot) => {
      this._employeeService.rows = [];
      snapshot.forEach((s) => {
        const _row = new EmployeeType(s.val());
        if (_row.resing === 'green') {
          if (_row.company_code === company_code) {
            this._employeeService.rows.push(_row);
          }
        }
      });
      this.employee = [...this._employeeService.rows];
    });
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

  setDatePrint() {
    const date = new Date();
    const month = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    this.datePrint = month[date.getMonth()] + ' ' + (date.getFullYear() + 543);
  }
}
