import {Component, Inject, OnInit} from '@angular/core';
import {Language} from 'angular-l10n';
import {FormControl} from '@angular/forms';
import {Payment} from './payment';
import {PaymentService} from './payment.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import {Department} from '../../../../setup/department/department';
import {ManagementService} from '../management.service';

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
              private _loadingService: TdLoadingService)  {

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
        // console.log('Prev Code :' + ss.payment_code );
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
    console.log(this.data.save_status);
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
            this.dialogRef.close(this.data);
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

  changePersonalIncomeTex(data) {
    console.log('=================' + data);
    // tslint:disable-next-line:radix
    data.total_income = parseInt(data.salary) + parseInt(data.personal_income_tex);
    this._paymentService.updateData(data);
  }

}
