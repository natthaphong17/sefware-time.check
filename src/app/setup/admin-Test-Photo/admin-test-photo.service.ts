import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Page } from '../../shared/model/page';
import { Observable } from 'rxjs';
import { PagedData } from '../../shared/model/paged-data';
import { CheckTime } from '../check-time/check-time';
import { Department } from '../department/department';

@Injectable()
export class AdminTestPhotoService {

  lists: FirebaseListObservable<any>;
  rows: CheckTime[] = [];
  _path: string = '/main/settings/check_time';

  constructor(private agFb: AngularFireDatabase) {
    this.lists = agFb.list(this._path, { preserveSnapshot: true });
  }
}
