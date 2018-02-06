import {Component, Inject, OnInit} from '@angular/core';
import {Language} from 'angular-l10n';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';
import {ManagementService} from '../management.service';
import {ResingService} from './resing.service';
import {Resing} from './resing';
import {Management} from '../management';

@Component({
  selector: 'app-resing',
  templateUrl: './resing.component.html',
  styleUrls: ['./resing.component.scss'],
  providers: [ResingService, ManagementService]
})
export class ResingComponent implements OnInit {
  @Language() lang: string;

  today = new Date();
  error: any;
  sum: any;

  data: Resing = new Resing({});

  dataPayment = [];
  ytd_income_last: any = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Resing,
              public dialogRef: MatDialogRef<ResingComponent>,
              private _resingService: ResingService,
              private _managementService: ManagementService,
              private _loadingService: TdLoadingService)  {
    try {
      if (md_data) {
        this.data = new Resing(md_data);
        if (!this.data.code) {
          this.generateCode();
        }
        // this._resingService.requestDataByCode(this.data.code).subscribe((pay) => {
        //   pay.forEach((s) => {
        //     if (s.pay_status !== 'paid') {
        //       this.data = new Payment(s);
        //     }
        //   });
        //   // console.log('MDDDD : ' + JSON.stringify(this.data));
        // });
      } else {
        this._resingService.requestData().subscribe(() => {
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
    this.data.code = prefix + '-001';
    // this._resingService.requestLastData().subscribe((s) => {
    //   s.forEach((ss: Resing) => {
    //     // console.log('Prev Code :' + ss.payment_code );
    //     // tslint:disable-next-line:radix
    //     const str = parseInt(ss.code.substring(ss.code.length - 3, ss.code.length)) + 1;
    //     let last = prefix + '-' + str;
    //
    //     if (str < 100) {
    //       last = prefix + '-0' + str;
    //     }
    //
    //     if (str < 10) {
    //       last = prefix + '-00' + str;
    //     }
    //
    //     this.data.ode = last;
    //   });
    //   this._loadingService.resolve('data.form');
    // });
  }

  closeResing(data) {
    const data1 = { code : data.code , resing : 'red'};
    this._managementService.updateData(data1 as Management);
    // console.log('CODE : ' + data.code);
  }
}
