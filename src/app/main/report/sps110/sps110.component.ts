import { Component, OnInit } from '@angular/core';
import {PrintingService} from '../../../setup/check-time/printing-service.service';
import {MatDialog} from '@angular/material';
import {SetCompanyProfileService} from '../../../setup/set-company-profile/set-company-profile.service';
import {EmployeeTypeService} from '../../../setup/employee/employee-type.service';
import {SetCompanyProfile} from '../../../setup/set-company-profile/set-company-profile';

@Component({
  selector: 'app-sps110',
  templateUrl: './sps110.component.html',
  styleUrls: ['./sps110.component.scss'],
  providers: [SetCompanyProfileService, PrintingService, EmployeeTypeService]
})
export class Sps110Component implements OnInit {

  data: SetCompanyProfile = new SetCompanyProfile({});

  employee = [];

  constructor(private _companyService: SetCompanyProfileService,
              private _printingService: PrintingService,
              private dialog: MatDialog,
              private _employeeService: EmployeeTypeService) { }

  ngOnInit() {
  }

  printReport(data) {
    this.print();
  }

  print() {
    const style = 'body {\n' +
      '    font-size: 12px;\n' +
      '  }\n' +
      '  .row {\n' +
      '    display: flex;\n' +
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
      '  .right {\n' +
      '    text-align: right;\n' +
      '  }\n' +
      '  .center {\n' +
      '    text-align: center;\n' +
      '  }\n' +
      '  .left {\n' +
      '    text-align: left;\n' +
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
      '  p {\n' +
      '    margin: 0px;\n' +
      '  }' +
      ' .pageBreak { ' +
      '   page-break-before: always; ' +
      '  }';
    this._printingService.print('sps110', 'report', style);
  }
}
