import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Page} from '../../shared/model/page';
import {Observable} from 'rxjs';
import {PagedData} from '../../shared/model/paged-data';
import {CheckTime} from './check-time';

@Injectable()
export class CheckTimeService {

  lists: FirebaseListObservable<any>;
  rows: CheckTime[] = [];
  _path: string = '/main/settings/check_time';

  constructor(private agFb: AngularFireDatabase) {
    this.lists = agFb.list(this._path, {preserveSnapshot: true});
  }

  getPath(): string {
    return this._path;
  }

  requestData() {
    return this.lists;
  }

  requestDateByEmployeeCode(code: string) {
    return this.agFb.object(this._path + '/' + code);
  }

  requestDateCheckOutNULL() {
    return this.lists = this.agFb.list(this._path, {
      query: {
        orderByChild: 'check_out_time',
        equalTo: null}});
  }

  searchDataByCodeAndNameAndDate(code: string, name: string, date: string) {
    if (code !== null && code !==  '' &&
    name !== null && name !==  '' &&
    date !== null && date !== '') {
      return this.lists = this.agFb.list(this._path, {
        query: {
          orderByChild: 'employee_code',
          equalTo: ''},
          preserveSnapshot: true});
    } else if (code !== null && code !==  '' &&
    date !== null && date !== '') {
      return this.requestByCodeAndDate(code, date);
    } else if (name !== null && name !==  '' &&
    date !== null && date !== '') {
      return this.requestByCodeAndDate(name, date);
    } else if (code !== null && code !==  '') {
      return this.requestByCode(code);
    } else if (name !== null && name !== '') {
      // ส่ง Employee Code เข้ามาแทน name
      return this.requestByCode(name);
    } else if (date !== null && date !== '') {
      const dateTime = new Date(date);
      const y = dateTime.getFullYear() + '';
      let m = (dateTime.getMonth() + 1) + '';
      let dS = (dateTime.getDate() - 1) + '';
      let dE = dateTime.getDate() + '';
      if (dateTime.getMonth() <= 9) {
        m = '0' + (dateTime.getMonth() + 1);
      }
      if (dateTime.getDate() <= 9) {
        dS = '0' + (dateTime.getDate() - 1);
        dE = '0' + dateTime.getDate();
      }
      const dateS = y + '-' + m + '-' + dS + 'T17:00:00.000Z';
      const dateE = y + '-' + m + '-' + dE + 'T16:59:00.000Z';
      return this.lists = this.agFb.list(this._path, {
        query: {
          orderByChild: 'date', startAt: dateS, endAt: dateE},
          preserveSnapshot: true});
    } else {
      return this.lists = this.agFb.list(this._path, {
        query: {
          orderByChild: 'employee_code',
          equalTo: ''},
          preserveSnapshot: true});
    }
  }

  getDateTime(date: string) {
    const dateTime = new Date(date);
    const y = dateTime.getFullYear() + '';
    let m = (dateTime.getMonth() + 1) + '';
    let d = dateTime.getDate() + '';
    if (dateTime.getMonth() <= 9) {
      m = '0' + (dateTime.getMonth() + 1);
    }
    if (dateTime.getDate() <= 9) {
      d = '0' + dateTime.getDate();
    }
    const dateStartSearch = y + m + d;
    return dateStartSearch;
  }

  requestByCodeAndDate(code: string, date: string) {
    const dateSearch = code + '-' + this.getDateTime(date);
    return this.lists = this.agFb.list(this._path, {
        query: {
          orderByChild: 'code',
          equalTo: dateSearch
        },
        preserveSnapshot: true});
  }

  requestByCode(code: string) {
    return this.lists = this.agFb.list(this._path, {
        query: {
          orderByChild: 'employee_code',
          equalTo: code},
          preserveSnapshot: true});
  }

  requestByMonthTomMonth(data) {
    const start = data.employeeCode + '-' + data.year + data.startMonth + '01';
    const end = data.employeeCode + '-' + data.year + data.endMonth + '31';
    return this.lists = this.agFb.list(this._path, {
      query: {
        orderByChild: 'code',
        startAt: start,
        endAt: end
      },
        preserveSnapshot: true
    });
  }

  requestDataByCode(code: string) {
    const date = new Date();
    const _month = date.getMonth() + 1;
    let month = _month + '';
    if (_month < 10) {
      month = '0' + _month;
    }
    const dateStart = code + '-' + date.getFullYear() + month + '00';
    const dateEnd = code + '-' + date.getFullYear() + month + '32';
    return this.lists = this.agFb.list(this._path, {query: {orderByChild: 'code', startAt: dateStart, endAt: dateEnd}, preserveSnapshot: true});
  }

  addData(data: CheckTime) {
    return this.lists.update(data.code, data);
  }

  updateData(data: CheckTime) {
    return this.lists.update(data.code, data);
  }

  updateDataStatus(data: CheckTime, active: boolean) {
    return this.lists.update(data.code, {
      disable: active
    });
  }

  removeData(data: CheckTime) {
    return this.lists.remove(data.code);
  }

  requestLastData() {
    return this.agFb.list(this._path, {
      query: {
        limitToLast: 1
      }
    });
  }

  public getResults(page: Page): Observable<PagedData<CheckTime>> {
    return Observable.of(this.rows).map((data) => this.getPagedData(page));
  }

  private getPagedData(page: Page): PagedData<CheckTime> {
    const pagedData = new PagedData<CheckTime>();
    page.totalElements = this.rows.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = this.rows[i];
      pagedData.data.push(new CheckTime(jsonObj));
    }
    pagedData.page = page;
    return pagedData;
  }

}
