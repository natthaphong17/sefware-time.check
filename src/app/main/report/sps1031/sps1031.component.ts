import { Component, OnInit } from '@angular/core';
import {SetCompanyProfile} from '../../../setup/set-company-profile/set-company-profile';
import {PrintingService} from '../../../setup/check-time/printing-service.service';
import {MatDialog} from '@angular/material';
import {SetCompanyProfileService} from '../../../setup/set-company-profile/set-company-profile.service';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {EmployeeType} from '../../../setup/employee/employee-type';

@Component({
  selector: 'app-sps1031',
  templateUrl: './sps1031.component.html',
  styleUrls: ['./sps1031.component.scss'],
  providers: [SetCompanyProfileService, EmployeeTypeService, PrintingService]

})
export class Sps1031Component implements OnInit {

  data: SetCompanyProfile = new SetCompanyProfile({});
  employee = [];

  constructor(private _companyService: SetCompanyProfileService,
              private _employeeService: EmployeeTypeService,
              private printingService: PrintingService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this._companyService.requestDataByCode('1').subscribe((snapshot) => {
      const _row = new SetCompanyProfile(snapshot);
      this.data = _row;
    });
  }

  printReport(data) {
    if (data.value.employee_start !== undefined && data.value.employee_end !== undefined) {
      this._employeeService.requestDataByCodeToCode(data.value.employee_start, data.value.employee_end).subscribe((snapshot) => {
        this._employeeService.rows = [];
        snapshot.forEach((s) => {
          const _row = new EmployeeType(s);
          const date = new Date(_row.work_start_date);
          if (date.getMonth().toString() === data.value.month.toString() && date.getFullYear().toString() === data.value.year.toString()) {
            this._employeeService.rows.push(_row);
          }
        });
        this.employee = [...this._employeeService.rows];
        if (this.employee.length <= 7) {
          this.setEmployeeData();
        }
      });
    } else {
      this._employeeService.requestData().subscribe((snapshot) => {
        this._employeeService.rows = [];
        snapshot.forEach((s) => {
          const _row = new EmployeeType(s.val());
          const date = new Date(_row.work_start_date);
          if (date.getMonth().toString() === data.value.month.toString() && date.getFullYear().toString() === data.value.year.toString()) {
            this._employeeService.rows.push(_row);
          }
        });
        this.employee = [...this._employeeService.rows];
        if (this.employee.length <= 7) {
          this.setEmployeeData();
        }
      });
    }
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'confirm',
        title: 'Print',
        content: 'Confirm to Print ?',
        data_title: 'Print !',
        data: ''
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.print();
      }
    });
  }
  print() {
    const styles  = 'table {width: 100%;}' +
      'table, th, td {border: 1px solid black;border-collapse: collapse;}' +
      'th, td {padding: 5px;text-align: left;}' +
      'th {text-align: center;font-size: 14px;}' +
      'div {font-size: 14px;padding: 4px;}' +
      '.row {display: flex;}';
    this.printingService.print('sps1031', 'report', styles);
  }
  setEmployeeData() {
    console.log(this.employee.length);
    const i = 7 - this.employee.length;
    let a = 0;
    while (a < i) {
      a++;
      this.employee.push('');
    }
  }

}
