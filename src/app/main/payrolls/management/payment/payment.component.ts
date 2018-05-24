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
import {PrintingService} from '../../../../setup/check-time/printing-service.service';
import {SetCompanyProfileService} from '../../../../setup/set-company-profile/set-company-profile.service';
import {SetCompanyProfile} from '../../../../setup/set-company-profile/set-company-profile';
import * as firebase from 'firebase';
import {EmployeeTypeService} from '../../../../setup/employee/employee-type.service';
import {AuthService} from '../../../../login/auth.service';
import {count} from '@angular/cli/node_modules/rxjs/operators';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [PaymentService, ManagementService, PrintingService, SetCompanyProfileService, EmployeeTypeService]
})
export class PaymentComponent implements OnInit {
  @Language() lang: string;

  today = new Date();
  error: any;

  data: Payment = new Payment({});

  company: any = [];

  user: firebase.User;

  get_ytd_provident_fund: any = 0;
  get_ytd_tex_sum: any = 0;
  get_ytd_sccial_sum: any = 0;
  get_ytd_income_sum: any = 0;
  this_year = new Date();

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Payment,
              public dialogRef: MatDialogRef<PaymentComponent>,
              private _paymentService: PaymentService,
              private _managementService: ManagementService,
              private _loadingService: TdLoadingService,
              public snackBar: MatSnackBar,
              private _logService: LogsService,
              private dialog: MatDialog,
              private printingService: PrintingService,
              private companyService: SetCompanyProfileService,
              private _authService: AuthService,
              private _employeeService: EmployeeTypeService)  {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
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
    this._employeeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      this.getCompany(snapshot[0].company_code);
    });
    this.setYTD();
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
    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      // this.data.name1 = form.value.name1 ? form.value.name1 : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
        } else {
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
    // tslint:disable-next-line:radix
    if (data.salary === 0 || data.salary === '0' || data.salary === null || data.salary === undefined || data.salary === '') {
      data.salary = 0;
    }
    if (data.social_security_monthly === 0 || data.social_security_monthly === '0' || data.social_security_monthly === null || data.social_security_monthly === undefined || data.social_security_monthly === '') {
      data.social_security_monthly = 0;
    }
    if (data.social_security_monthly_emp === 0 || data.social_security_monthly_emp === '0' || data.social_security_monthly_emp === null || data.social_security_monthly_emp === undefined || data.social_security_monthly_emp === '') {
      data.social_security_monthly_emp = 0;
    }
    if (data.bonus_allowance === 0 || data.bonus_allowance === '0' || data.bonus_allowance === null || data.bonus_allowance === undefined || data.bonus_allowance === '') {
      data.bonus_allowance = 0;
    }
    if (data.incentive === 0 || data.incentive === '0' || data.incentive === null || data.incentive === undefined || data.incentive === '') {
      data.incentive = 0;
    }
    if (data.comission === 0 || data.comission === '0' || data.comission === null || data.comission === undefined || data.comission === '') {
      data.comission = 0;
    }
    if (data.personal_income_tex === 0 || data.personal_income_tex === '0' || data.personal_income_tex === null || data.personal_income_tex === undefined || data.personal_income_tex === '') {
      data.personal_income_tex = 0;
    }
    if (data.take_leave_no_pay === 0 || data.take_leave_no_pay === '0' || data.take_leave_no_pay === null || data.take_leave_no_pay === undefined || data.take_leave_no_pay === '') {
      data.take_leave_no_pay = 0;
    }
    if (data.meal_deduction === 0 || data.meal_deduction === '0' || data.meal_deduction === null || data.meal_deduction === undefined || data.meal_deduction === '') {
      data.meal_deduction = 0;
    }
    if (data.provident_fund === 0 || data.provident_fund === '0' || data.provident_fund === null || data.provident_fund === undefined || data.provident_fund === '') {
      data.provident_fund = 0;
    }
    // tslint:disable-next-line:radix
    data.total_deduction = parseInt(data.personal_income_tex) + parseInt(data.social_security_monthly) + parseInt(data.take_leave_no_pay) + parseInt(data.meal_deduction);
    // tslint:disable-next-line:radix
    data.total_income = parseInt(data.salary) + parseInt(data.bonus_allowance) + parseInt(data.incentive) + parseInt(data.social_security_monthly_emp) + parseInt(data.comission);

      // tslint:disable-next-line:radix
    data.ytd_income = parseInt(this.get_ytd_income_sum) + parseInt(data.total_income);
      // tslint:disable-next-line:radix
    data.ytd_tax = parseInt(this.get_ytd_tex_sum) + parseInt(data.personal_income_tex);
      // tslint:disable-next-line:radix
    data.ytd_social_security = parseInt(this.get_ytd_sccial_sum) + parseInt(data.social_security_monthly);
      // tslint:disable-next-line:radix
    data.ytd_provident_fund = parseInt(this.get_ytd_provident_fund) + parseInt(data.provident_fund);
  }
  setYTD() {
    // SET YTD
    this._paymentService.requestData().subscribe((emp) => {
      emp.forEach((e) => {
        if (this.data.emp_code === e.val().emp_code) {
          if (e.val().pay_status === 'paid') {
            const year = new Date(e.val().period).getFullYear();
            if (year === this.this_year.getFullYear()) {
              // tslint:disable-next-line:radix
              this.get_ytd_provident_fund = this.get_ytd_provident_fund + parseInt(e.val().provident_fund);
              // tslint:disable-next-line:radix
              this.get_ytd_tex_sum = this.get_ytd_tex_sum + parseInt(e.val().personal_income_tex);
              // tslint:disable-next-line:radix
              this.get_ytd_sccial_sum = this.get_ytd_sccial_sum + parseInt(e.val().social_security_monthly);
              // tslint:disable-next-line:radix
              this.get_ytd_income_sum = this.get_ytd_income_sum + parseInt(e.val().total_income);
              // console.log('E TOTAL : ' + e.val().total_income);
              // console.log('Get Lest : ' + ytd_income_sum);
            }
          }
        }
        this.data.ytd_provident_fund = this.get_ytd_provident_fund;
        this.data.ytd_tax = this.get_ytd_tex_sum;
        this.data.ytd_social_security = this.get_ytd_sccial_sum;
        this.data.ytd_income = this.get_ytd_income_sum;
      });
    });
  }
  updateData(data) {
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
        const styles  = 'table {width: 100%;}' +
          'table, th, td {border: 1px solid black;border-collapse: collapse;}' +
          'th, td {padding: 5px;text-align: left;font-size: 10px;}' +
          'th {background: #C5E1A5; text-align: center;}' +
          '.td01 {text-align: left;border-top: none; border-bottom: none;}' +
          '.td02 {text-align: right;border-top: none; border-bottom: none;}' +
          '.td03 {border: none;}' +
          '.td04 {background: #C5E1A5;}';
        this.printingService.print(this.data.emp_code, 'report', styles);
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
  getCompany(company_code) {
    this.companyService.requestDataByCode(company_code).subscribe((snapshot) => {
      const _row = new SetCompanyProfile(snapshot);
      this.company = _row;
    });
  }
}
