import { Component, OnInit } from '@angular/core';
import {SetCompanyProfile} from '../../../setup/set-company-profile/set-company-profile';
import {SetCompanyProfileService} from '../../../setup/set-company-profile/set-company-profile.service';
import {PrintingService} from '../../../setup/check-time/printing-service.service';
import {setStyles} from '@angular/animations/browser/src/util';
import {style} from '@angular/core/src/animation/dsl';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {MatDialog} from '@angular/material';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {EmployeeType} from '../../../setup/employee/employee-type';

@Component({
  selector: 'app-sps609',
  templateUrl: './sps609.component.html',
  styleUrls: ['./sps609.component.scss'],
  providers: [SetCompanyProfileService, PrintingService, EmployeeTypeService]
})
export class Sps609Component implements OnInit {

  data: SetCompanyProfile = new SetCompanyProfile({});

  employee = [];

  ID: string = '';

  constructor(private _companyService: SetCompanyProfileService,
              private _printingService: PrintingService,
              private dialog: MatDialog,
              private _employeeService: EmployeeTypeService) { }

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
    this.ID = data.value.month + (data.value.year + '');
    if (data.value.month === undefined) {
      this._employeeService.requestData().subscribe((snapshot) => {
        this._employeeService.rows = [];
        snapshot.forEach((s) => {
          const _row = new EmployeeType(s.val());
          const date = new Date(_row.resing_date);
          if (_row.resing === 'red') {
            if (date.getFullYear().toString() === data.value.year) {
              this._employeeService.rows.push(_row);
              console.log(_row);
            }
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
          if (_row.resing === 'red') {
            const date = new Date(_row.resing_date);
            if (date.getFullYear().toString() === data.value.year) {
              if (date.getMonth().toString() === data.value.month) {
                this._employeeService.rows.push(_row);
                console.log(_row);
              }
            }
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
    const styles  = 'body {\n' +
      '    font-size: 12px;\n' +
      '  }\n' +
      '\n' +
      '  div {\n' +
      '    padding: 1px;\n' +
      '  }\n' +
      '\n' +
      '  .row {\n' +
      '    display: flex;\n' +
      '  }\n' +
      '\n' +
      '  img {\n' +
      '    width: 100px;\n' +
      '    height: 100px;\n' +
      '  }\n' +
      '\n' +
      '  .left {\n' +
      '    text-align: left;\n' +
      '  }\n' +
      '\n' +
      '  .center {\n' +
      '    text-align: center;\n' +
      '  }\n' +
      '\n' +
      '  .right {\n' +
      '    text-align: right;\n' +
      '  }\n' +
      '\n' +
      '  table {\n' +
      '    width: 100%;\n' +
      '  }\n' +
      '\n' +
      '  table, th, td {\n' +
      '    border: 1px solid black;\n' +
      '    border-collapse: collapse;\n' +
      '  }\n' +
      '\n' +
      '  th, td {\n' +
      '    padding: 5px;\n' +
      '    text-align: left;}\n' +
      '\n' +
      '  th {\n' +
      '    text-align: center;\n' +
      '    font-size: 12px;\n' +
      '  }';
    this._printingService.print('sps609' + this.ID, 'report', styles);
  }

  setEmployeeData() {
    const i = 7 - this.employee.length;
    let a = 0;
    while (a < i) {
      a++;
      this.employee.push('');
    }
  }

}
