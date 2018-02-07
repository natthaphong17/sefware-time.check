import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Page} from '../../shared/model/page';
import {Observable} from 'rxjs';
import {PagedData} from '../../shared/model/paged-data';
import {SettingNetworkLocal} from './setting-network-local';

@Injectable()
export class WorkingtimesettingTypeService {

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
    return this.lists.update(data.code, data);
  }
}
