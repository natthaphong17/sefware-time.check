import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {ItemSubGroup} from './item-sub-group';
import {Page} from '../../shared/model/page';
import {Observable} from 'rxjs';
import {PagedData} from '../../shared/model/paged-data';

@Injectable()
export class ItemSubGroupService {

  lists: FirebaseListObservable<any>;
  rows: ItemSubGroup[] = [];
  _path: string = '/main/settings/item_sub_group';

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

  addData(data: ItemSubGroup) {
    return this.lists.update(data.code, data);
  }

  updateData(data: ItemSubGroup) {
    return this.lists.update(data.code, data);
  }

  updateDataStatus(data: ItemSubGroup, active: boolean) {
    return this.lists.update(data.code, {
      disable: active
    });
  }

  removeData(data: ItemSubGroup) {
    return this.lists.remove(data.code);
  }

  requestLastData(prefix: string) {
    return this.agFb.list(this._path, {
      query: {
        orderByChild: 'code',
        startAt: prefix + '00',
        endAt: prefix + '99',
        limitToLast: 1
      }
    });
  }

  requestDataByGroup(group: string) {
    return this.agFb.list(this._path, {
      query: {
        orderByChild: 'group_code',
        equalTo: group
      }
    });
  }

  public getResults(page: Page): Observable<PagedData<ItemSubGroup>> {
    return Observable.of(this.rows).map((data) => this.getPagedData(page));
  }

  private getPagedData(page: Page): PagedData<ItemSubGroup> {
    const pagedData = new PagedData<ItemSubGroup>();
    page.totalElements = this.rows.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = this.rows[i];
      pagedData.data.push(new ItemSubGroup(jsonObj));
    }
    pagedData.page = page;
    return pagedData;
  }

}
