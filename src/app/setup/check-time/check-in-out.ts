import { Injectable } from '@angular/core';
import {CheckTime} from './check-time';
import {CheckTimeService} from './check-time.service';
import {WorkingtimesettingTypeService} from '../workingtimesetting/workingtimesetting-type.service';
import {TdLoadingService} from '@covalent/core';
import {EmployeeTypeService} from '../employee/employee-type.service';
import {WorkingTimeSettingType} from '../workingtimesetting/workingtimesetting-type';
import {AuthService} from '../../login/auth.service';

@Injectable()
export class CheckInOut {

  data: CheckTime = new CheckTime({});

  error = '';
  timeSetting = [];
  timeIn: string = '';
  timeOut: string = '';

  constructor(private _authService: AuthService,
              private _workingTimeService: WorkingtimesettingTypeService,
              private _loadingService: TdLoadingService,
              private _checkTimeService: CheckTimeService,
              private _employeeService: EmployeeTypeService) {
    this.loadWorkingTimeSetting();
  }
  load() {
    this._checkTimeService.requestData().subscribe((item) => {
      item.forEach((s) => {
        const _row = new CheckTime(s.val());
        if (_row.check_in_time !== undefined) {
          if (_row.check_in_result === undefined) {
            this.checkInOut(_row.employee_code, _row.check_in_time, _row.check_in_result, '', undefined);
          }
        }
        if (_row.check_out_time !== undefined) {
          if (_row.check_out_result === undefined) {
            this.checkInOut(_row.employee_code, '', undefined, _row.check_out_time, _row.check_out_result);
          }
        }
      });
    });
  }

  autoCheckOut() {
    let i = 0;
    const dateNow = new Date();
    this._checkTimeService.requestDateCheckOutNULL().subscribe((snapshot) => {
      if (i <= 0) {
        snapshot.forEach((s) => {
          const _row = new CheckTime(s);
          if (_row.check_out_time === undefined) {
            const date = new Date(_row.date);
            if ((dateNow.getTime() - date.getTime()) >= 86400000) {
              let month = '' + (date.getMonth() + 1);
              if (date.getMonth() < 10) {
                month = '0' + month;
              }
              let day = '' + date.getDate();
              if (date.getDate() < 10) {
                day = '0' + day;
              }
              _row.check_out_time = date.getFullYear() + '-' + month +
                '-' + day + 'T' + '11:00:00.000Z';
              this.checkInOut(_row.employee_code, '', '', _row.check_out_time, _row.check_out_status);
            }
          }
        });
        i++;
      }
    });
  }

  checkInOut(employee_code, check_in, check_in_status, check_out, check_out_status) {
    this._employeeService.requestDataByCode(employee_code).subscribe((snapshot) => {
      this.timeIn = snapshot.check_in;
      this.timeOut = snapshot.check_out;

      if (check_in !== '' && check_in_status === undefined) {
        check_in = new Date(check_in); // ค่าเวลาที่ส่งมา
        // กำหนดค่าให้ Code & Date & EmployeeCode
        this.data.code = this.getCode(employee_code, check_in);
        this.data.employee_code = employee_code;

        this.setCheckIn(check_in);
      }
      if (check_out !== '' && check_out_status === undefined) {
        check_out = new Date(check_out); // จำลองค่าเวลาที่ส่งมา
        // กำหนดค่าให้ Code & Date & EmployeeCode
        this.data.code = this.getCode(employee_code, check_out);
        this.data.employee_code = employee_code;

        this.setCheckOut(check_out);
      }
      this.data = new CheckTime({});
    });
  }

  setCheckIn(date) {
    this.data.date = date;
    let arrayDate = [];
    arrayDate = this.getCheckResult(date, 'checkIn');
    this.data.check_in_time = arrayDate[0];
    this.data.check_in_result = arrayDate[1];
    this.data.check_in_status = arrayDate[2];
    // เพิ่มข้อมูลเข้าไปให้ดาต้าเบล
    this._checkTimeService.addData(this.data).then(() => {}).catch((err) => {});
  }

  setCheckOut(date) {
    let arrayDate = [];
    arrayDate = this.getCheckResult(date, 'checkOut');
    this.data.check_out_time = arrayDate[0];
    this.data.check_out_result = arrayDate[1];
    this.data.check_out_status = arrayDate[2];
    // เพิ่มข้อมูลเข้าไปให้ดาต้าเบล
    this._checkTimeService.updateData(this.data).then(() => {}).catch((err) => {});
  }

  getCode(code, date) {
    // ใช้ในการ สร้างโค๊ด
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
    } else if (status === 'checkOut') {
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
      if (this.timeIn === s.check_in) {
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
                  const time = date.getTime();
                  const days = Math.floor(time / (60 * 60 * 24 * 1000));
                  const hours = Math.floor(time / (60 * 60 * 1000)) - (days * 24);
                  const minutes = Math.floor(time / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
                  const seconds = Math.floor(time / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
                  if (seconds === 0) {
                    diff = _setTime.getTime() - date.getTime();
                  } else {
                    diff = date.getTime() - _setTime.getTime();
                  }
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
      if (this.timeOut === s.check_out) {
        const _setTime = new Date(month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' +
          '' + s.check_out + ':00 GMT+07:00'); // ค่าที่ Set ไว้

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

        const _row = new WorkingTimeSettingType(s.val());
        this._workingTimeService.rows.push(_row);

      });
      this.timeSetting = [...this._workingTimeService.rows];
    });
  }
}
