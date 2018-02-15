import { Component, OnInit } from '@angular/core';
import {SetCompanyProfile} from '../../../setup/set-company-profile/set-company-profile';
import {SetCompanyProfileService} from '../../../setup/set-company-profile/set-company-profile.service';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {EmployeeType} from '../../../setup/employee/employee-type';
import {PrintingService} from '../../../setup/check-time/printing-service.service';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-pjd1',
  templateUrl: './pjd1.component.html',
  styleUrls: ['./pjd1.component.scss'],
  providers: [SetCompanyProfileService, EmployeeTypeService, PrintingService]
})
export class Pjd1Component implements OnInit {

  data: SetCompanyProfile = new SetCompanyProfile({});
  employee = [];

  datePrint = '';

  constructor(private _companyService: SetCompanyProfileService,
              private _employeeService: EmployeeTypeService,
              private printingService: PrintingService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.load();
    this.setDatePrint();
  }

  load() {
    this._companyService.requestDataByCode('1').subscribe((snapshot) => {
      const _row = new SetCompanyProfile(snapshot);
      this.data = _row;
    });
  }

  printReport(data) {
    if (this.employee.length <= 8) {
      this.setEmployeeData();
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
      '    font-size: 14px;\n' +
      '  }\n' +
      '  div {\n' +
      '    /*border: 1px solid black;*/\n' +
      '    padding: 1px;\n' +
      '  }\n' +
      '  .row {\n' +
      '    display: flex;\n' +
      '  }\n' +
      '  .right {\n' +
      '    text-align: right;\n' +
      '  }\n' +
      '  .center {\n' +
      '    text-align: center;\n' +
      '  }\n' +
      '  .left {\n' +
      '    text-align: left;\n' +
      '  }\n' +
      '  .redBox {\n' +
      '    text-align: center;\n' +
      '    padding: 5px;\n' +
      '    border: 5px solid red;\n' +
      '    color: red;\n' +
      '    background: #6d6d6d;\n' +
      '  }\n' +
      '  .loc-md-1{\n' +
      '    width: 10%;\n' +
      '  }\n' +
      '  .loc-md-2{\n' +
      '    width: 20%;\n' +
      '  }\n' +
      '  .loc-md-3{\n' +
      '    width: 30%;\n' +
      '  }\n' +
      '  .loc-md-4{\n' +
      '    width: 50%;\n' +
      '  }\n' +
      '  .loc-md-5{\n' +
      '    width: 60%;\n' +
      '  }\n' +
      '  .loc-md-6{\n' +
      '    width: 60%;\n' +
      '  }\n' +
      '  .loc-md-7{\n' +
      '    width: 80%;\n' +
      '  }\n' +
      '  .loc-md-8{\n' +
      '    width: 90%;\n' +
      '  }\n' +
      '  .loc-md-9{\n' +
      '    width: 90%;\n' +
      '  }\n' +
      '  .loc-md-10{\n' +
      '    width: 100%;\n' +
      '  }\n' +
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
      '  }\n' +
      '  td {\n' +
      '    text-align: left;\n' +
      '    font-size: 10px;\n' +
      '  }\n' +
      '  .verticalText {\n' +
      '    -webkit-transform: rotate(-90deg);\n' +
      '    -moz-transform: rotate(-90deg);\n' +
      '  }';
    this.printingService.print('pjd1', 'report', styles);
  }
  setEmployeeData() {
    console.log(this.employee.length);
    const i = 8 - this.employee.length;
    let a = 0;
    while (a < i) {
      a++;
      this.employee.push('');
    }
  }

  setDatePrint() {
    const date = new Date();
    const month = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    this.datePrint = month[date.getMonth()] + ' ' + (date.getFullYear() + 543);
  }
}
