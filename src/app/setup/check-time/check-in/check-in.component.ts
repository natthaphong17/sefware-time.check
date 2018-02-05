import {Component, Inject, OnInit} from '@angular/core';
import {CheckTime} from '../check-time';
import {LogsService} from '../../../dialog/logs-dialog/logs.service';
import {TdLoadingService} from '@covalent/core';
import {Holidays} from '../../holidays/holidays';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CheckTimeService} from '../check-time.service';
import {WorkingtimesettingTypeService} from '../../workingtimesetting/workingtimesetting-type.service';
import {ItemType} from '../../item-type/item-type';
import {forEach} from '@angular/router/src/utils/collection';
import {CheckInOut} from '../check-in-out';
import {CheckInOutTimeService} from '../check-in-out-time.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss'],
  providers: [CheckTimeService, WorkingtimesettingTypeService, LogsService, CheckInOut, CheckInOutTimeService]
})
export class CheckInComponent implements OnInit {

  data: CheckTime = new CheckTime({});

  error: any;
  timeSetting = [];
  hours: string = '';
  minutes: string = '';

  time_hours = [];
  time_minutes = [];

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: CheckTime,
              public dialogRef: MatDialogRef<CheckInComponent>,
              private _checkTimeService: CheckTimeService,
              private _workingTimeService: WorkingtimesettingTypeService,
              private _loadingService: TdLoadingService,
              private _checkInOutTime: CheckInOut) { }

  ngOnInit() {
    this.loadWorkingTimeSetting();
    this.generateTime();
  }
  saveData(form) {
    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      const month = ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const _date = month[form.value.date.getMonth()] + ' ' + form.value.date.getDate() + ', ' + form.value.date.getFullYear() + ' ' +
        '' + this.hours + ':' + this.minutes + ':00 GMT+07:00'; // เวลาที่รับมาจากหน้า view
      form.value.date = new Date(_date); // จำลองค่าเวลาที่ส่งมา
      // กำหนดค่าให้ Code & Date & EmployeeCode
      this.data.employee_code = form.value.employee_code ? form.value.employee_code : null;
      this.data.code = this._checkInOutTime.getCode(this.data.employee_code, form.value.date);
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

  getCheckResult(date) {
    const checkInTime = date;
    let checkInResult = null;
    let checkInStatus = null;
    let result = [];

    let diff = null;

    if (date.getHours() < 12) {
      diff = this._checkInOutTime.checkIn(date);
    } else {
      diff = this._checkInOutTime.checkOut(date);
    }

    checkInResult = this._checkInOutTime.timeToSetting(diff[1]);
    checkInStatus = diff[0];

    result = [checkInTime, checkInResult, checkInStatus];
    return result;
  }

  generateTime() {
    for (let i = 0; i < 60; i++) {
      let _i = '' + i;
      if (i < 10) {
        _i = '0' + i;
      }
      if (i < 24) {
        this.time_hours.push(_i);
      }
      this.time_minutes.push(_i);

    }
  }

}
