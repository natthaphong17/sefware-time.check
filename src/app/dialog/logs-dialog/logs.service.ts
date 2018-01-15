import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Logs} from './logs';
import {Observable} from 'rxjs';
import {Page} from '../../shared/model/page';
import {PagedData} from '../../shared/model/paged-data';
import {AuthService} from '../../login/auth.service';

@Injectable()
export class LogsService {

  lists: FirebaseListObservable<any>;
  rows: Logs[] = [];

  constructor(private _agFb: AngularFireDatabase,
              private _authService: AuthService) {

  }

  requestData(_path: string) {
    return this._agFb.list('logs/' + _path, {preserveSnapshot: true});
  }

  requestDataByRef(_path: string, ref: string) {
    return this.lists = this._agFb.list('logs/' + _path, {query: {orderByChild: 'ref', equalTo: ref}, preserveSnapshot: true});
  }

  addLog(_path: string, log: Logs): void {
    this._authService.user.subscribe((user) => {
      log.user = user.displayName;
      log.email = user.email;
      log.photo = user.photoURL;
      this._agFb.list('logs/' + _path).push(log);
    });
  }

  public getResults(page: Page): Observable<PagedData<Logs>> {
    return Observable.of(this.rows).map((data) => this.getPagedData(page));
  }

  private getPagedData(page: Page): PagedData<Logs> {
    const pagedData = new PagedData<Logs>();
    page.totalElements = this.rows.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = this.rows[i];
      pagedData.data.push(new Logs(jsonObj));
    }
    pagedData.page = page;
    return pagedData;
  }

}
