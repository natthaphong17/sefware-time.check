import {Component, Inject, OnInit} from '@angular/core';
import {ManagementComponent} from '../management.component';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ManagementService} from '../management.service';
import { Location } from '@angular/common';
import {EmployeeType} from '../../../../setup/employee/employee-type';
import {EmployeeTypeService} from '../../../../setup/employee/employee-type.service';
import {AuthService} from '../../../../login/auth.service';
import * as firebase from 'firebase';
import { version as appVersion } from '../../../../../../package.json';

@Component({
  selector: 'app-new-payments',
  templateUrl: './new-payments.component.html',
  styleUrls: ['./new-payments.component.scss'],
  providers: [ManagementService, EmployeeTypeService, AuthService]
})
export class NewPaymentsComponent implements OnInit {
  public appVersion;
  user: firebase.User;
  company_check = '';
  constructor(@Inject(MAT_DIALOG_DATA)  private _management: ManagementComponent,
              private location: Location,
              private _employeetypeService: EmployeeTypeService,
              private _authService: AuthService,
              private _managementService: ManagementService) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;
  }

  ngOnInit() {
    this.setEmployee();
  }

  upDatePaymentStatus() {
    this._managementService.requestEmployeeData().subscribe((emp) => {
      emp.forEach((e) => {
        if (e.val().company_code === this.company_check) {
          if (e.val().resing === 'greed') {
            this._managementService.updatePayStatus(e.val());
          }
        }
      });
    });
    location.reload();
  }
  setEmployee() {
    this._employeetypeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
      const _employeedata = new EmployeeType(snapshot[0]);
      this.company_check = _employeedata.company_code;
    });
  }

}
