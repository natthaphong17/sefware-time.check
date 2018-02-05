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
  _path: string = '/main/settings/check-time';

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
