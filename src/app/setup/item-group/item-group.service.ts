import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {ItemGroup} from './item-group';
import {Page} from '../../shared/model/page';
import {Observable} from 'rxjs';
import {PagedData} from '../../shared/model/paged-data';

@Injectable()
export class ItemGroupService {

  lists: FirebaseListObservable<any>;
  rows: ItemGroup[] = [];
  _path: string = '/main/settings/item_group';

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

  addData(data: ItemGroup) {
    return this.lists.update(data.code, data);
  }

  updateData(data: ItemGroup) {
    return this.lists.update(data.code, data);
  }

  updateDataStatus(data: ItemGroup, active: boolean) {
    return this.lists.update(data.code, {
      disable: active
    });
  }

  removeData(data: ItemGroup) {
    return this.lists.remove(data.code);
  }

  requestLastData(prefix: string) {
    return this.agFb.list(this._path, {
      query: {
        orderByChild: 'code',
        startAt: prefix + '0',
        endAt: prefix + '9',
        limitToLast: 1
      }
    });
  }

  requestDataByType(type: string) {
    return this.agFb.list(this._path, {
      query: {
        orderByChild: 'type_code',
        equalTo: type
      }
    });
  }

  public getResults(page: Page): Observable<PagedData<ItemGroup>> {
    return Observable.of(this.rows).map((data) => this.getPagedData(page));
  }

  private getPagedData(page: Page): PagedData<ItemGroup> {
    const pagedData = new PagedData<ItemGroup>();
    page.totalElements = this.rows.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = this.rows[i];
      pagedData.data.push(new ItemGroup(jsonObj));
    }
    pagedData.page = page;
    return pagedData;
  }

}
