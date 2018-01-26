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

  requestDataByCode(code: string) {
    return this.lists = this.agFb.list(this._path, {query: {orderByChild: 'employee_code', equalTo: code}, preserveSnapshot: true});
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
