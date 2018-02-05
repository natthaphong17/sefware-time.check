import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {CheckInOutTime} from './check-in-out-time';

@Injectable()
export class CheckInOutTimeService {

  lists: FirebaseListObservable<any>;
  rows: CheckInOutTime[] = [];
  _path: string = '/main/settings/check_in_out';

  constructor(private agFb: AngularFireDatabase) {
    this.lists = agFb.list(this._path, {preserveSnapshot: true});
  }

  requestData() {
    return this.lists;
  }

  removeData(data: CheckInOutTime) {
    this.lists.remove(data.code);
  }

}
