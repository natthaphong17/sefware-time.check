import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Language, LocaleService} from 'angular-l10n';
import {TdMediaService} from '@covalent/core';
import {EmployeeTypeService} from '../../setup/employee/employee-type.service';
import {AuthService} from '../../login/auth.service';
import {EmployeeType} from '../../setup/employee/employee-type';

@Component({
  selector: 'app-payrolls',
  templateUrl: './payrolls.component.html',
  styleUrls: ['./payrolls.component.scss'],
  providers: [ EmployeeTypeService ]
})
export class PayrollsComponent implements OnInit, AfterViewInit {
  @Language() lang: string;

  row = false;

  constructor(public locale: LocaleService,
              public router: Router,
              public _authService: AuthService,
              private _employeeService: EmployeeTypeService,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {
    this._authService.user.subscribe((user) => {
      this.setEmployee(user.email);
    });

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  setEmployee(userEmail: string) {
    this._employeeService.requestDataByEmail(userEmail).subscribe((snapshot) => {
      const _row = new EmployeeType(snapshot[0]);
      if (_row.level === '1' || _row.level === '2') {
        this.row = true;
      }
    });
  }

}
