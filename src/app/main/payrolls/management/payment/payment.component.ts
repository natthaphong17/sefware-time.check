import {Component, Inject, OnInit} from '@angular/core';
import {Language} from 'angular-l10n';
import {FormControl} from '@angular/forms';
import {Payment} from './payment';
import {PaymentService} from './payment.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import {ManagementService} from '../management.service';
import {ConfirmComponent} from '../../../../dialog/confirm/confirm.component';
import {LogsDialogComponent} from '../../../dialog/logs-dialog/logs-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Logs} from '../../../../dialog/logs-dialog/logs';
import {LogsService} from '../../../../dialog/logs-dialog/logs.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [PaymentService, ManagementService]
})
export class PaymentComponent implements OnInit {
  @Language() lang: string;

  today = new Date();
  error: any;

  data: Payment = new Payment({});


  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Payment,
              public dialogRef: MatDialogRef<PaymentComponent>,
              private _paymentService: PaymentService,
              private _managementService: ManagementService,
              private _loadingService: TdLoadingService,
              public snackBar: MatSnackBar,
              private _logService: LogsService,
              private dialog: MatDialog)  {
    try {
      if (md_data) {
        this.data = new Payment(md_data);
        if (!this.data.payment_code) {
          this.generateCode();
        }
        this._paymentService.requestDataByCode(this.data.code).subscribe((pay) => {
          pay.forEach((s) => {
            if (s.pay_status !== 'paid') {
              this.data = new Payment(s);
            }
          });
          // console.log('MDDDD : ' + JSON.stringify(this.data));
        });
      } else {
        this._paymentService.requestData().subscribe(() => {
        });
      }
    } catch (error) {
      this.error = error;
    }
  }
  ngOnInit() {
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._managementService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._managementService.getPath(), log);
  }

  generateCode() {
    this._loadingService.register('data.form');
    let prefix = '';
    const years = this.today.getFullYear();
    const months = this.today.getMonth() + 1;
    if (months < 10) {
      prefix = '' + years + '0' + months;
    } else {
      prefix = '' + years + months;
    }
    this.data.payment_code = prefix + '-001';
    this._paymentService.requestLastData().subscribe((s) => {
      s.forEach((ss: Payment) => {
        // tslint:disable-next-line:radix
        const str = parseInt(ss.payment_code.substring(ss.payment_code.length - 3, ss.payment_code.length)) + 1;
        let last = prefix + '-' + str;

        if (str < 100) {
          last = prefix + '-0' + str;
        }

        if (str < 10) {
          last = prefix + '-00' + str;
        }

        this.data.payment_code = last;
      });
      this._loadingService.resolve('data.form');
    });
  }

  saveData(form) {
    // console.log(this.data.save_status);
    const data_status = { code : this.data.code , pay_status : this.data.pay_status , save_status : this.data.save_status};
    this._managementService.updateDataPayStatus(data_status);
    this.changeData(this.data);
    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      // this.data.name1 = form.value.name1 ? form.value.name1 : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
        } else {
          this.changeData(this.data);
          this._paymentService.updateData(this.data).then(() => {
            // this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._paymentService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }
  changeData(data) {
    let ytd_provident_fund: any = 0;
    let ytd_tex_sum: any = 0;
    let ytd_sccial_sum: any = 0;
    let ytd_income_sum: any = 0;
    let new_data: Payment = new Payment({});
    this._paymentService.requestData().subscribe((emp) => {
      emp.forEach((e) => {
        new_data = new Payment(e);
        if (data.code === e.val().code) {
          // tslint:disable-next-line:radix
          ytd_provident_fund = ytd_provident_fund + parseInt(e.val().provident_fund);
          // tslint:disable-next-line:radix
          ytd_tex_sum = ytd_tex_sum + parseInt(e.val().personal_income_tex);
          // tslint:disable-next-line:radix
          ytd_sccial_sum = ytd_sccial_sum + parseInt(e.val().social_security_monthly);
          // tslint:disable-next-line:radix
          ytd_income_sum = ytd_income_sum + parseInt(e.val().total_income);
          // console.log('E TOTAL : ' + e.val().total_income);
          // console.log('Get Lest : ' + ytd_income_sum);
        }
        data.ytd_provident_fund = ytd_provident_fund;
        data.ytd_tax = ytd_tex_sum;
        data.ytd_social_security = ytd_sccial_sum;
        data.ytd_income = ytd_income_sum;
        // console.log('E Code : ' + e.val().code + data.code);
      });
      // console.log('Data.Code : ' + data.code);
      // console.log('Data.TOTAL : ' + data.total_income);
      // console.log('YTD INCOME : ' + data.ytd_income);
    });
    // tslint:disable-next-line:radix
    data.total_deduction = parseInt(data.personal_income_tex) + parseInt(data.social_security_monthly) + parseInt(data.take_leave_no_pay) + parseInt(data.meal_deduction);
    // tslint:disable-next-line:radix
    data.total_income = parseInt(data.salary) + parseInt(data.bonus_allowance) + parseInt(data.incentive) + parseInt(data.social_security_monthly_emp + parseInt(data.comission));
    // console.log('Code : ' + data.code);
    this._paymentService.updateData(data);
    // this.saveData(data);
    // Changa Save Status
    const data_status = { code : this.data.code, save_status : this.data.save_status};
    this._managementService.updateDataSaveStatus(data_status);
  }

  setYTD(data) {
    // console.log('PAYMENT CODE : ' + data.payment_code);
    this.changeData(data);
  }

  updateData(data) {
    // console.log('PAYMENT CODE : ' + data.payment_code);
    this._paymentService.updateData(data);
  }

  confirmPayment(data: Payment) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'payment',
        title: 'Payment Employee',
        content: 'Confirm to Payment ?',
        data_title: 'Payment !',
        data: this.data.code + ' : ' + this.data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        const data_status = { code : this.data.code , pay_status : this.data.pay_status , save_status : this.data.save_status};
        this._managementService.updateDataPayStatus(data_status);
        // this.changeData(this.data);
        this._paymentService.updateData(this.data).then(() => {
          this.snackBar.open('Payment employee succeed.', '', {duration: 3000});
          this.addLog('Payment', 'Payment employee succeed', this.data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
      this.dialogRef.close(this.data);
    });
  }
  // sumTotalIncome() {
  //   this.dataPayment.forEach((e) => {
  //     console.log()
  //     const new_data = new Payment(e);
  //     if (this.data.code === new_data.code) {
  //       // tslint:disable-next-line:radix
  //       this.ytd_income_last = this.ytd_income_last + parseInt(e.val().total_income);
  //       // console.log('E TOTAL : ' + e.val().total_income);
  //       // console.log('Get Lest : ' + ytd_income_last);
  //     }
  //     this.sum = this.ytd_income_last;
  //     // console.log('E Code : ' + e.val().code);
  //   });
  // }
  //
  // getDataPayment() {
  //   this._paymentService.requestData().subscribe((emp) => {
  //     this._paymentService.rows = [];
  //     emp.forEach((e) => {
  //       const _row = new Payment(e);
  //       this._paymentService.rows.push(_row);
  //     });
  //     this.dataPayment = [...this._paymentService.rows];
  //   });
  // }

  changeData2(data) {
    let ytd_deduction_sum: any = 0;
    let ytd_tex_sum: any = 0;
    let ytd_sccial_sum: any = 0;
    let ytd_income_sum: any = 0;
    let new_data: Payment = new Payment({});
    this._paymentService.requestData().subscribe((emp) => {
      emp.forEach((e) => {
        new_data = new Payment(e);
        if (data.code === e.val().code) {
          // tslint:disable-next-line:radix
          ytd_deduction_sum = ytd_deduction_sum + parseInt(e.val().total_deduction);
          // tslint:disable-next-line:radix
          ytd_tex_sum = ytd_tex_sum + parseInt(e.val().personal_income_tex);
          // tslint:disable-next-line:radix
          ytd_sccial_sum = ytd_sccial_sum + parseInt(e.val().social_security_monthly);
          // tslint:disable-next-line:radix
          ytd_income_sum = ytd_income_sum + parseInt(e.val().total_income);
          // console.log('E TOTAL : ' + e.val().total_income);
          // console.log('Get Lest : ' + ytd_income_sum);
        }
        data.ytd_provident_fund = ytd_deduction_sum;
        data.ytd_tax = ytd_tex_sum;
        data.ytd_social_security = ytd_sccial_sum;
        data.ytd_income = ytd_income_sum;
        // console.log('E Code : ' + e.val().code + data.code);
      });
      // console.log('Data.Code : ' + data.code);
      // console.log('Data.TOTAL : ' + data.total_income);
      // console.log('YTD INCOME : ' + data.ytd_income);
    });
    // tslint:disable-next-line:radix
    data.total_deduction = parseInt(data.personal_income_tex) + parseInt(data.social_security_monthly) + parseInt(data.take_leave_no_pay) + parseInt(data.meal_deduction);
    // tslint:disable-next-line:radix
    data.total_income = parseInt(data.salary) + parseInt(data.bonus_allowance) + parseInt(data.incentive) + parseInt(data.social_security_monthly_emp);
    // console.log('Code : ' + data.code);
    this._paymentService.updateData(data);
    // Changa Save Status
    const data_status = { code : this.data.code, save_status : this.data.save_status};
    this._managementService.updateDataSaveStatus(data_status);
    // this.setYTD(data);
  }
}
