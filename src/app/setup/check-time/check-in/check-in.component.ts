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
import {EmployeeTypeService} from '../../employee/employee-type.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss'],
  providers: [CheckTimeService, WorkingtimesettingTypeService, LogsService, CheckInOut, EmployeeTypeService]
})
export class CheckInComponent implements OnInit {

  data: CheckTime = new CheckTime({});

  error: any;

  time_hours = [];
  time_minutes = [];

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: CheckTime,
              public dialogRef: MatDialogRef<CheckInComponent>,
              private _checkTimeService: CheckTimeService,
              private _workingTimeService: WorkingtimesettingTypeService,
              private _loadingService: TdLoadingService,
              private _checkInOutTime: CheckInOut) { }

  ngOnInit() {
    this.generateTime();
  }
  saveData(form) {
    if (form.valid) {

      this.error = false;
      this._loadingService.register();
      let check_in = '';
      let check_out = '';

      const month = ['January', 'February', 'March', 'April', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const _date = month[form.value.date.getMonth()] + ' ' + form.value.date.getDate() + ', ' + form.value.date.getFullYear() + ' ' +
        '' + form.value.hours + ':' + form.value.minutes + ':00 GMT+07:00'; // เวลาที่รับมาจากหน้า view

      if (form.value.status === 'check-in') {
        check_in = _date;
      } else if (form.value.status === 'check-out') {
        check_out = _date;
      }

      this._checkInOutTime.checkInOut(form.value.employee_code, check_in, undefined, check_out, undefined);
      this._loadingService.resolve();
    }
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
