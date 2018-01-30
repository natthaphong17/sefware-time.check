import {Component, Inject, OnInit} from '@angular/core';
import {CheckTime} from '../check-time';
import {LogsService} from '../../../dialog/logs-dialog/logs.service';
import {TdLoadingService} from '@covalent/core';
import {Holidays} from '../../holidays/holidays';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CheckTimeService} from '../check-time.service';
import {WorkingtimesettingTypeService} from '../../workingtimesetting/workingtimesetting-type.service';
import {ItemType} from '../../item-type/item-type';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss'],
  providers: [CheckTimeService, WorkingtimesettingTypeService, LogsService]
})
export class CheckInComponent implements OnInit {

  data: CheckTime = new CheckTime({});

  error: any;
  timeSetting = [];

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: CheckTime,
              public dialogRef: MatDialogRef<CheckInComponent>,
              private _checkTimeService: CheckTimeService,
              private _workingTimeService: WorkingtimesettingTypeService,
              private _loadingService: TdLoadingService) { }

  ngOnInit() {
    this.loadWorkingTimeSetting();
    this.testTimeToSetting();
  }

  saveData(form) {
    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      const _date = 'January 5, 2018 10:03:00 GMT+07:00'; // เวลาที่รับมาจากหน้า view
      form.value.date = new Date(_date); // จำลองค่าเวลาที่ส่งมา
      // กำหนดค่าให้ Code & Date & EmployeeCode
      this.data.employee_code = form.value.employee_code ? form.value.employee_code : null;
      this.data.code = this.getCode(this.data.employee_code, form.value.date);
      if (form.value.date.getHours() <= 12) {
        this.data.date = form.value.date;
        // กำหนดค่าให้ค่าใน Check In Time
        let data = [];
        data = this.getCheckResult(form.value.date);
        this.data.check_in_time = data[0];
        this.data.check_in_result = data[1];
        this.data.check_in_status = data[2];
      } else {
        let data = [];
        data = this.getCheckResult(form.value.date);
        this.data.check_out_time = data[0];
        this.data.check_out_result = data[1];
        this.data.check_out_status = data[2];
      }
      // เพิ่มข้อมูลเข้าไปให้ดาต้าเบล
      this._checkTimeService.addData(this.data).then(() => {
        this.dialogRef.close(this.data);
        this._loadingService.resolve();
      }).catch((err) => {
        this.error = err.message;
        this._loadingService.resolve();
      });
    }
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

  getCode(employee_code, date) {
    const _year = date.getFullYear();
    let _month = date.getMonth() + 1;
    if (_month < 10) {
      _month = '0' + _month;
    }
    let _days = date.getDate();
    if (_days < 10) {
      _days = '0' + _days;
    }
    const result = employee_code + '-' + _year + _month + _days;
    return result;
  }

  getCheckResult(date) {
    const checkInTime = date;
    let checkInResult = null;
    let checkInStatus = null;
    let result = [];

    let diff = null;

    if (date.getHours() < 12) {
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
    let status = null;
    let diff = null;
    const month = ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.timeSetting.forEach((s) => {
      const _setTime =  new Date(month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + s.check_in + ':00 GMT+07:00'); // ค่าที่ Set ไว้
      if (date.getHours() >= (_setTime.getHours() - 2).toString() && date.getHours() <= (_setTime.getHours() + 1).toString()) {
        if (date.getHours() >= _setTime.getHours()) {
          if (date.getMinutes() <= s.late && date.getHours() <= _setTime.getHours()) {
            if (status === 'good' || status === null) {
              diff = date.getTime() - _setTime.getTime();
              status = 'good';
            }
          } else if (date.getMinutes() > s.late && date.getHours() <= _setTime.getHours()) {
            diff = date.getTime() - _setTime.getTime();
            status = 'fire';
          } else {
            diff = date.getTime() - _setTime.getTime();
            status = 'improve';
          }
        } else {
          diff = _setTime.getTime() - date.getTime();
          status = 'good';
        }
      } else {
        if (date.getHours() >= _setTime.getHours()) {
          diff = date.getTime() - _setTime.getTime();
          status = 'improve';
        } else {
          diff = _setTime.getTime() - date.getTime();
          status = 'improve';
        }
      }
    });
    return [status, diff];
  }

  checkOut(date) {
    let status = null;
    let diff = null;
    const month = ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.timeSetting.forEach((s) => {
      const _setTime =  new Date(month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + s.check_out + ':00 GMT+07:00'); // ค่าที่ Set ไว้

      if (date.getHours() >= _setTime.getHours()) {
        if (status === 'good' || status === null) {
          diff = date.getTime() - _setTime.getTime();
          status = 'good';
        }
      } else {
        if (date.getHours() >= (_setTime.getHours() - 1).toString()) {
          diff = _setTime.getTime() - date.getTime();
          status = 'fire';
        } else {
          diff = _setTime.getTime() - date.getTime();
          status = 'improve';
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

  testTimeToSetting() {
    const data1 = new Date('December 25, 2018 00:00:00 GMT+07:00');
    const data2 = new Date('January 15, 2019 00:00:00 GMT+07:00');
    const date = data2.getTime() - data1.getTime();

    const days = Math.floor(date / (60 * 60 * 24 * 1000));
    console.log(days + 1);
  }

}
