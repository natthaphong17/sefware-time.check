import { Injectable } from '@angular/core';
import {CheckTime} from './check-time';
import {CheckTimeService} from './check-time.service';
import {ItemType} from '../item-type/item-type';
import {WorkingtimesettingTypeService} from '../workingtimesetting/workingtimesetting-type.service';
import {TdLoadingService} from '@covalent/core';
import {MatDialogRef} from '@angular/material';
import {CheckInOutTimeService} from './check-in-out-time.service';
import {CheckInOutTime} from './check-in-out-time';

@Injectable()
export class CheckInOut {

  data: CheckTime = new CheckTime({});

  error = '';
  timeSetting = [];

  dataCheckInTime = [];

  constructor(private _workingTimeService: WorkingtimesettingTypeService,
              public dialogRef: MatDialogRef<CheckInOut>,
              private _loadingService: TdLoadingService,
              private _checkTimeService: CheckTimeService,
              private _checkInOutTimeService: CheckInOutTimeService) {
    this.loadWorkingTimeSetting();
    // this.loadDataCheckInTime();
  }
  load() {
    this._checkInOutTimeService.requestData().subscribe((snapshot) => {
      snapshot.forEach((s) => {

        const _row = new CheckInOutTime(s.val());
        this.checkInOut(_row.employee_code, _row.date);
        this._checkInOutTimeService.removeData(_row);

      });
    });
  }

  checkInOut(employee_code, date) {
    date = new Date(date); // จำลองค่าเวลาที่ส่งมา
    // กำหนดค่าให้ Code & Date & EmployeeCode
    this.data.code = this.getCode(employee_code, date);
    this.data.employee_code = employee_code;

    this.setCheckInOut(date);
  }

  setCheckInOut(date) {
    if (date.getHours() <= 12) {
      this.data.date = date;
      let arrayDate = [];
      arrayDate = this.getCheckResult(date, 'checkIn');
      this.data.check_in_time = arrayDate[0];
      this.data.check_in_result = arrayDate[1];
      this.data.check_in_status = arrayDate[2];
    } else {
      let arrayDate = [];
      arrayDate = this.getCheckResult(date, '');
      this.data.check_out_time = arrayDate[0];
      this.data.check_out_result = arrayDate[1];
      this.data.check_out_status = arrayDate[2];
    }
    // เพิ่มข้อมูลเข้าไปให้ดาต้าเบล
    this._checkTimeService.addData(this.data).then(() => {}).catch((err) => {});
  }

  getCode(code, date) {
    const _year = date.getFullYear();
    let _month = date.getMonth() + 1;
    if (_month < 10) {
      _month = '0' + _month;
    }
    let _days = date.getDate();
    if (_days < 10) {
      _days = '0' + _days;
    }
    const result = code + '-' + _year + _month + _days;
    return result;
  }

  getCheckResult(date, status) {
    const checkInTime = date;
    let checkInResult = null;
    let checkInStatus = null;
    let result = [];

    let diff = null;

    if (status === 'checkIn') {
      diff = this.checkIn(date);
    } else {
      diff = this.checkOut(date);
    }

    checkInResult = this.timeToSetting(diff[1]);
    checkInStatus = diff[0];

    result = [checkInTime, checkInResult, checkInStatus];
    return result;
  }

  checkIn(date) {
    date = new Date(date);
    let status = null;
    let diff = null;
    const month = ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let keepGoing = true;
    this.timeSetting.forEach((s) => {
      if (keepGoing) {
        const _setTime = new Date(month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + s.check_in + ':00 GMT+07:00'); // ค่าที่ Set ไว้
        if (date.getHours() >= (_setTime.getHours() - 2).toString() && date.getHours() <= (_setTime.getHours() + 1).toString()) {
          let timeCh = 0;
          let late = s.late;
          if (late >= 60) {
            timeCh = timeCh + 1;
            late = late - 60;
          }
          if (date.getHours() >= _setTime.getHours()) {
            if (date.getMinutes() <= late && date.getHours() === _setTime.getHours()) {
              if (date.getMinutes() === 0) {
                diff = _setTime.getTime() - date.getTime();
                status = 'Good';
                keepGoing = false;
              } else {
                diff = date.getTime() - _setTime.getTime();
                status = s.policy + '-Good';
              }
              keepGoing = false;
            } else if (date.getMinutes() > late && date.getHours() === (_setTime.getHours() + timeCh)) {
              diff = date.getTime() - _setTime.getTime();
              status = s.policy;
            } else if (date.getHours() > _setTime.getHours()) {
              diff = date.getTime() - _setTime.getTime();
              status = 'Non Pay';
            }
          } else {
            diff = _setTime.getTime() - date.getTime();
            status = 'Good';
            keepGoing = false;
          }
        } else {
          if (date.getHours() >= _setTime.getHours()) {
            diff = date.getTime() - _setTime.getTime();
            status = 'Non Pay';
          } else {
            diff = _setTime.getTime() - date.getTime();
            status = 'Non Pay';
          }
          keepGoing = false;
        }
      }
    });
    return [status, diff];
  }

  checkOut(date) {
    date = new Date(date);
    let status = null;
    let diff = null;
    const month = ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.timeSetting.forEach((s) => {
      const _setTime =  new Date(month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + s.check_out + ':00 GMT+07:00'); // ค่าที่ Set ไว้

      if (date.getHours() >= _setTime.getHours()) {
        if (status === 'Good' || status === null) {
          diff = date.getTime() - _setTime.getTime();
          status = 'Good';
        }
      } else {
        if (date.getHours() >= (_setTime.getHours() - 1).toString()) {
          diff = _setTime.getTime() - date.getTime();
          status = 'Warning';
        } else {
          diff = _setTime.getTime() - date.getTime();
          status = 'Non Pay';
        }
      }
    });
    return [status, diff];
  }

  timeToSetting(date) {
    const days = Math.floor(date / (60 * 60 * 24 * 1000));
    const hours = Math.floor(date / (60 * 60 * 1000)) - (days * 24);
    const minutes = Math.floor(date / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    const seconds = Math.floor(date / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    let _hours = '' + hours;
    let _minutes = '' + minutes;
    let _seconds = '' + seconds;
    if (hours < 10) {
      _hours = '0' + hours;
    }
    if (minutes < 10) {
      _minutes = '0' + minutes;
    }
    if (seconds < 10) {
      _seconds = '0' + seconds;
    }
    return _hours + ':' + _minutes + ':' + _seconds;
  }

  loadWorkingTimeSetting() {
    this._workingTimeService.requestData().subscribe((snapshot) => {
      this._workingTimeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new ItemType(s.val());
        this._workingTimeService.rows.push(_row);

      });
      this.timeSetting = [...this._workingTimeService.rows];
    });
  }
  loadDataCheckInTime() {
    this._checkInOutTimeService.requestData().subscribe((snapshot) => {
      this._checkInOutTimeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new CheckInOutTime(s.val());
        this._checkInOutTimeService.rows.push(_row);

      });
      this.dataCheckInTime = [...this._checkInOutTimeService.rows];
    });
  }
}
