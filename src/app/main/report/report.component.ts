import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Language, LocaleService} from 'angular-l10n';
import {TdMediaService} from '@covalent/core';
import {EmployeeType} from '../../setup/employee/employee-type';
import { version as appVersion } from '../../../../package.json';
import {AuthService} from '../../login/auth.service';
import {EmployeeTypeService} from '../../setup/employee/employee-type.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [AuthService, EmployeeTypeService]
})
export class ReportComponent implements OnInit, AfterViewInit {
  @Language() lang: string;

  status = false;
  public appVersion;
  user: firebase.User;

  constructor(public locale: LocaleService,
              public router: Router,
              private _employeetypeService: EmployeeTypeService,
              private _authService: AuthService,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {
    this._authService.user.subscribe((user) => {
      this.user = user;
    });
    this.appVersion = appVersion;
  }

  ngOnInit(): void {
    // this.setEmployee();
  }

  ngAfterViewInit(): void {
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  // setEmployee() {
  //   this._employeetypeService.requestDataByEmail(this.user.email).subscribe((snapshot) => {
  //     const _employeedata = new EmployeeType(snapshot[0]);
  //     if (_employeedata.level === '1' || _employeedata.level === '2' || _employeedata.level === '0') {
  //       this.status = true;
  //     } else {
  //       this.status = false;
  //     }
  //   });
  // }
}
