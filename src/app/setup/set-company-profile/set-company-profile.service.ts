import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Page} from '../../shared/model/page';
import {Observable} from 'rxjs';
import {PagedData} from '../../shared/model/paged-data';
import {SetCompanyProfile} from '../set-company-profile/set-company-profile';

@Injectable()
export class SetCompanyProfileService {

  lists: FirebaseListObservable<any>;
  rows: SetCompanyProfile[] = [];
  _path: string = '/main/settings/set_company_profile';

  constructor(private agFb: AngularFireDatabase) {
    this.lists = agFb.list(this._path, {preserveSnapshot: true});
  }

  requestDataByCode(code: string) {
    return this.agFb.object(this._path + '/' + code);
  }

  updateData(data: SetCompanyProfile) {
    return this.lists.update(data.code, data);
  }
}
