import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import {AuthService} from '../../../login/auth.service';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {SetCompanyProfile} from '../../../setup/set-company-profile/set-company-profile';
import {SetCompanyProfileService} from '../../../setup/set-company-profile/set-company-profile.service';
import {PaymentService} from '../../payrolls/management/payment/payment.service';
import {Payment} from '../../payrolls/management/payment/payment';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {MatDialog} from '@angular/material';
import {PrintingService} from '../../../setup/check-time/printing-service.service';

@Component({
  selector: 'app-pay-slip',
  templateUrl: './pay-slip.component.html',
  styleUrls: ['./pay-slip.component.scss'],
  providers: [PaymentService, PrintingService]
})
export class PaySlipComponent implements OnInit {

  user: firebase.User;

  company: SetCompanyProfile = new SetCompanyProfile({});
  payment: any  = [];
  dataPrint: any = [];
  idPrint: number = 0;
  printPage: number = 0;

  constructor(private _authService: AuthService,
              private _employeeService: EmployeeTypeService,
              private _companyService: SetCompanyProfileService,
              private _paymentService: PaymentService,
              private dialog: MatDialog,
              private _printingService: PrintingService) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.getCompany();
    this.getPayment();
  }

  printReport(form) {
    this.dataPrint = [];
    this.idPrint++;
    this.payment.forEach((pay) => {
      const _row = new Payment(pay);
      const payDate = new Date(_row.payment_date);
      if (payDate.getFullYear().toString() === form.value.year) {
        if (form.value.month !== undefined) {
          if (payDate.getMonth().toString() === form.value.month) {
            this.dataPrint.push(_row);
          }
        } else {
          this.dataPrint.push(_row);
        }
      }
    });
    if (form.value.employee_start === undefined || form.value.employee_start === '') {
      form.value.employee_start = 0;
    }
    if (form.value.employee_end === undefined || form.value.employee_end === '') {
      form.value.employee_end = 9999999;
    }
    this.dataPrint = this.dataPrint.filter((item) => item.emp_code >= form.value.employee_start && item.emp_code <= form.value.employee_end);
    this.printPage = this.dataPrint.length;
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

  getCompany() {
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      this._companyService.requestDataByCode(snapshot[0].company_code).subscribe((snapshot1) => {
        const _row = new SetCompanyProfile(snapshot1);
        this.company = _row;
      });
    });
  }

  getPayment() {
    this._paymentService.requestData().subscribe((snapshot) => {
      this._paymentService.rows = [];
      snapshot.forEach((s) => {
        const _row = new Payment(s.val());
        if (_row.pay_status === 'paid') {
          this._paymentService.rows.push(_row);
        }
      });
      this.payment = [...this._paymentService.rows];
    });
  }

  print() {
    const style = 'table {width: 100%;}' +
      'table, th, td {border: 1px solid black;border-collapse: collapse;}' +
      'th, td {padding: 5px;text-align: left;font-size: 10px;}' +
      'th {background: #C5E1A5; text-align: center;}' +
      '.td01 {text-align: left;border-top: none; border-bottom: none;}' +
      '.td02 {text-align: right;border-top: none; border-bottom: none;}' +
      '.td03 {border: none;}' +
      '.td04 {background: #C5E1A5;}' +
      '.pageBreak {page-break-before: always;}';
    this._printingService.print(this.idPrint + '', 'report', style);
  }
}
