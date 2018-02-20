import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Page} from '../../shared/model/page';
import {Observable} from 'rxjs';
import {PagedData} from '../../shared/model/paged-data';
import {SettingNetworkLocal} from './setting-network-local';
import {Department} from '../department/department';

@Injectable()
export class SettingNetworkLocalService {

  lists: FirebaseListObservable<any>;
  rows: SettingNetworkLocal[] = [];
  _path: string = '/main/settings/setting_network_local';

  constructor(private agFb: AngularFireDatabase) {
    this.lists = agFb.list(this._path, {preserveSnapshot: true});
  }

  requestDataByCode(code: string) {
    return this.agFb.object(this._path + '/' + code);
  }

  updateData(data: SettingNetworkLocal) {
    console.log('See Code :' + data.code);
    return this.lists.update(data.code, data);
  }

  requestLastData() {
    return this.agFb.list(this._path, {
      query: {
        limitToLast: 1
      }
    });
  }

  requestData() {
    return this.lists;
  }

  addData(data: Department) {
    return this.lists.update(data.code, data);
  }
}
