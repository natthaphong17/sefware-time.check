import { Component, OnInit } from '@angular/core';
import {SetCompanyProfile} from '../../../setup/set-company-profile/set-company-profile';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {SetCompanyProfileService} from '../../../setup/set-company-profile/set-company-profile.service';
import {PrintingService} from '../../../setup/check-time/printing-service.service';
import {MatDialog} from '@angular/material';
import {EmployeeType} from '../../../setup/employee/employee-type';
import {Payment} from '../../payrolls/management/payment/payment';
import {PaymentService} from '../../payrolls/management/payment/payment.service';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import * as firebase from 'firebase';
import {AuthService} from '../../../login/auth.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss'],
  providers: [SetCompanyProfileService, PrintingService, EmployeeTypeService, PaymentService]
})
export class TaxComponent implements OnInit {

  data: SetCompanyProfile = new SetCompanyProfile({});

  employee = [];
  payment = [];

  temp: any = [];

  date = new Date();

  user: firebase.User;

  constructor(private _companyService: SetCompanyProfileService,
              private _printingService: PrintingService,
              private _authService: AuthService,
              private dialog: MatDialog,
              private _employeeService: EmployeeTypeService,
              private _paymentService: PaymentService) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      this.load(snapshot[0].company_code);
      this.getEmployee();
      this.getPaymentData();
    });
  }

  load(company_code) {
    this._companyService.requestDataByCode(company_code).subscribe((snapshot) => {
      const _row = new SetCompanyProfile(snapshot);
      this.data = _row;
    });
  }

  printReport(data) {
    this.employee.forEach((emp) => {
      this.payment.forEach((pay) => {
        if (emp.code === pay.code) {
          const payDate = new Date(pay.payment_date);
          if (payDate.getFullYear().toString() === data.value.year) {
            emp.date_payment = pay.payment_date;
            emp.total_payment = emp.total_payment + pay.total_income;
            const a = pay.provident_fund.toString();
            // tslint:disable-next-line:radix
            const b = parseInt(a);
            emp.total_deduction = emp.total_deduction + pay.total_deduction + b;
          }
        }
      });
    });
    this.temp = this.employee.filter( (item) => item.code === data.value.employee_code);
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
      '    font-size: 11px;' +
      '    margin: 0px;\n' +
      '  }\n' +
      '  .row {\n' +
      '    display: flex;\n' +
      '  }\n' +
      '\n' +
      '  .redBox {\n' +
      '    text-align: center;\n' +
      '    padding: 5px;\n' +
      '    border: 5px solid red;\n' +
      '    color: red;\n' +
      '    background: #6d6d6d;\n' +
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
      '  .border {\n' +
      '    border: 1px solid black;\n' +
      '  }\n' +
      '  .nonBorder {\n' +
      '    border: none;\n' +
      '  }\n' +
      '  .borderStyle {\n' +
      '    border: 1px solid black;\n' +
      '    border-radius: 5px;\n' +
      '    margin-top: 1px;\n' +
      '    margin-bottom: 1px;\n' +
      '  }table {\n' +
      '    width: 100%;\n' +
      '    border-radius: 1px;\n' +
      '  }\n' +
      '\n' +
      '  table, th, td {\n' +
      '    border: 1px solid black;\n' +
      '    border-collapse: collapse;\n' +
      '  }\n' +
      '\n' +
      '  th, td {\n' +
      '    padding: 1px;\n' +
      '    text-align: left;}\n' +
      '\n' +
      '  th {\n' +
      '    text-align: center;\n' +
      '    font-size: 10px;\n' +
      '  }' +
      '  td {\n' +
      '    text-align: left;\n' +
      '    font-size: 9px;\n' +
      '  }';
    this._printingService.print('tax', 'report', style);
    this.temp = [];
    this.getEmployee();
    this.getPaymentData();
  }

  getEmployee() {
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
}
