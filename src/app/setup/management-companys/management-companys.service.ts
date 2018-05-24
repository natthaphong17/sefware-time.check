import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Page} from '../../shared/model/page';
import {Observable} from 'rxjs';
import {PagedData} from '../../shared/model/paged-data';
import {ManagementCompanys} from './management-companys';

@Injectable()
export class ManagementCompanysService {

  lists: FirebaseListObservable<any>;
  rows: ManagementCompanys[] = [];
  _path: string = '/main/settings/set_company_profile';

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

  requestDataByEmail(email: string) {
    return this.agFb.list(this._path, {
      query: {
        orderByChild: 'email',
        equalTo: email
      }
    });
  }

  addData(data: ManagementCompanys) {
    return this.lists.update(data.code, data);
  }

  updateData(data: ManagementCompanys) {
    return this.lists.update(data.code, data);
  }

  updateDataStatus(data: ManagementCompanys, active: boolean) {
    return this.lists.update(data.code, {
      disable: active
    });
  }

  removeData(data: ManagementCompanys) {
    return this.lists.remove(data.code);
  }

  requestLastData() {
    return this.agFb.list(this._path, {
      query: {
        limitToLast: 1
      }
    });
  }

  public getResults(page: Page): Observable<PagedData<ManagementCompanys>> {
    return Observable.of(this.rows).map((data) => this.getPagedData(page));
  }

  private getPagedData(page: Page): PagedData<ManagementCompanys> {
    const pagedData = new PagedData<ManagementCompanys>();
    page.totalElements = this.rows.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = this.rows[i];
      pagedData.data.push(new ManagementCompanys(jsonObj));
    }
    pagedData.page = page;
    return pagedData;
  }

}
