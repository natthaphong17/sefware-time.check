import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Management, TakeLeave} from './management';
import {Page} from '../../../shared/model/page';
import {Observable} from 'rxjs';
import {PagedData} from '../../../shared/model/paged-data';

@Injectable()
export class ManagementService {
  lists: FirebaseListObservable<any>;
  lists_take_leave: FirebaseListObservable<any>;
  rows: Management [] = [];
  _path: string = '/main/settings/employee';
  _path_take_leave: string = '/main/settings/take_leave';

  constructor(private agFb: AngularFireDatabase) {
    this.lists = agFb.list(this._path, {preserveSnapshot: true});
    this.lists_take_leave = agFb.list(this._path_take_leave, {preserveSnapshot: true});
  }

  getPath(): string {
    return this._path;
  }

  requestData() {
    return this.lists;
  }

  requestTakeLeaveData(code: string) {
    return this.agFb.list(this._path_take_leave, {
      query: {
        orderByChild: 'employee_code',
        equalTo: code
      }
    });
  }

  requestDataByCode(code: string) {
    return this.agFb.object(this._path + '/' + code);
  }

  addData(data: Management) {
    return this.lists.update(data.code, data);
  }

  updateData(data: Management) {
    return this.lists.update(data.code, data);
  }

  updateDataPayStatus(data_status) {
    return this.lists.update(data_status.code, {
      pay_status: data_status.pay_status,
      save_status: data_status.save_status
    });
  }

  updateDataStatus(data: Management, active: boolean) {
    return this.lists.update(data.code, {
      disable: active
    });
  }

  removeData(data: Management) {
    return this.lists.remove(data.code);
  }

  requestLastData() {
    return this.agFb.list(this._path, {
      query: {
        limitToLast: 1
      }
    });
  }

  public getResults(page: Page): Observable<PagedData<Management>> {
    return Observable.of(this.rows).map((data) => this.getPagedData(page));
  }

  private getPagedData(page: Page): PagedData<Management> {
    const pagedData = new PagedData<Management>();
    page.totalElements = this.rows.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = this.rows[i];
      pagedData.data.push(new Management(jsonObj));
    }
    pagedData.page = page;
    return pagedData;
  }
}
