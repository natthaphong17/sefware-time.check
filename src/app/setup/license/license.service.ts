import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Page} from '../../shared/model/page';
import {Observable} from 'rxjs';
import {PagedData} from '../../shared/model/paged-data';
import {License} from './license';

@Injectable()
export class LicenseService {

  lists: FirebaseListObservable<any>;
  rows: License[] = [];
  _path: string = '/main/settings/license';

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
    return this.agFb.object(this._path + '/' + code);
  }

  requestDataByCodeToCode(code_start: string, code_end: string) {
    return this.agFb.list(this._path, {
      query: {
        orderByChild: 'code',
        startAt: code_start,
        endAt: code_end
      }
    });
  }

  requestDataByLicense(license: string) {
    return this.agFb.list(this._path, {
      query: {
        orderByChild: 'license',
        equalTo: license
      }
    });
  }

  addData(data: License) {
    return this.lists.update(data.code, data);
  }

  updateData(data: License) {
    return this.lists.update(data.code, data);
  }

  updateDataStatus(data: License, active: boolean) {
    return this.lists.update(data.code, {
      disable: active
    });
  }

  removeData(data: License) {
    return this.lists.remove(data.code);
  }

  requestLastData() {
    return this.agFb.list(this._path, {
      query: {
        limitToLast: 1
      }
    });
  }

  public getResults(page: Page): Observable<PagedData<License>> {
    return Observable.of(this.rows).map((data) => this.getPagedData(page));
  }

  private getPagedData(page: Page): PagedData<License> {
    const pagedData = new PagedData<License>();
    page.totalElements = this.rows.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = this.rows[i];
      pagedData.data.push(new License(jsonObj));
    }
    pagedData.page = page;
    return pagedData;
  }

}
