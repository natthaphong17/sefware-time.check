import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Page } from '../../shared/model/page';
import { Observable } from 'rxjs';
import { PagedData } from '../../shared/model/paged-data';
import { CheckTime } from '../check-time/check-time';

@Injectable()
export class SettingPhotoService {

  lists: FirebaseListObservable<any>;
  listsAutoMode: FirebaseListObservable<any>;
  rows: CheckTime[] = [];
  _path: string = '/main/settings/check_time';
  _pathAutoMode: string = '/main/settings/auto_mode_delete_photo';

  constructor(private agFb: AngularFireDatabase) {
    this.lists = agFb.list(this._path, { preserveSnapshot: true });
    this.listsAutoMode = agFb.list(this._pathAutoMode, { preserveSnapshot: true });
  }

  getPath(): string {
    return this._path;
  }

  requestData() {
    return this.lists;
  }

  requestDateByEmployeeCode(code: string) {
    return this.agFb.object(this._path + '/' + code);
  }

  requestDataByCode(code: string) {
    const date = new Date();
    const _month = date.getMonth() + 1;
    let month = _month + '';
    if (_month < 10) {
      month = '0' + _month;
    }
    const dateStart = code + '-' + date.getFullYear() + month + '00';
    const dateEnd = code + '-' + date.getFullYear() + month + '32';
    return this.lists = this.agFb.list(this._path, { query: { orderByChild: 'code', startAt: dateStart, endAt: dateEnd }, preserveSnapshot: true });
  }

  addData(data: CheckTime) {
    return this.lists.update(data.code, data);
  }

  updateData(data: CheckTime) {
    return this.lists.update(data.code, data);
  }

  requestDataByCodeDate(startDate: string, endDate: string) {
    return this.agFb.list(this._path, {
      query: {
        orderByChild: 'date',
        startAt: startDate,
        endAt: endDate
      }
    });
  }

  requestDataByPhotoPath() {
    return this.agFb.list(this._path, {
      query: {
        orderByChild: 'photo_path',
        startAt: 'main',
        endAt: 'mains'
      }
    });
  }

  addDataAutoMode(data) {
    return this.listsAutoMode.update(data.code, data);
  }
  requestDateByAutoModeCode(code: string) {
    return this.agFb.list(this._pathAutoMode, {
      query: {
        orderByChild: 'code',
        equalTo: code
      }
    });
  }

}
