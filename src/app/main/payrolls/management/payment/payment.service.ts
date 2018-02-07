import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Payment} from '../payment/payment';

@Injectable()
export class PaymentService {
  lists: FirebaseListObservable<any>;
  rows: Payment [] = [];
  _path: string = '/main/settings/payment';

  constructor(private agFb: AngularFireDatabase) {
    this.lists = agFb.list(this._path, {preserveSnapshot: true});
  }

  getPath(): string {
    return this._path;
  }

  requestData() {
    return this.lists;
  }

  requestDataByCode(code: string) {
    return this.agFb.list(this._path, {
      query: {
        orderByChild: 'code',
        equalTo: code
      }
    });
  }

  requestLastPaymentData(code) {
    console.log('RQ : ' + code);
    return this.agFb.list(this._path + '/' + code, {
      query: {
        limitToLast: 1
      }
    });
  }

  requestLastData() {
    return this.agFb.list(this._path, {
      query: {
        limitToLast: 1
      }
    });
  }

  addData(data: Payment) {
    return this.lists.update(data.payment_code, data);
  }

  updateData(data: Payment) {
    return this.lists.update(data.payment_code, data);
  }
}
