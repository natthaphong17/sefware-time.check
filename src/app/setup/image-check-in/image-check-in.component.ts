import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { EmployeeTypeService } from '../employee/employee-type.service';
import { CheckTimeService } from '../check-time/check-time.service';
import {AuthService} from '../../login/auth.service';

@Component({
  selector: 'app-image-check-in',
  templateUrl: './image-check-in.component.html',
  styleUrls: ['./image-check-in.component.scss'],
  providers: [EmployeeTypeService, CheckTimeService]
})
export class ImageCheckInComponent implements OnInit {
  employeeCode: FormControl;
  employeeName: FormControl;
  date: FormControl;
  filteredEmployeeName: Observable<any[]>;

  names = [];

  list = [];

  company = '';

  constructor(private _authService: AuthService,
              private _employeeService: EmployeeTypeService,
              private _checkTimeService: CheckTimeService) {
    this.employeeCode = new FormControl();
    this.employeeName = new FormControl();
    this.date = new FormControl();
    this.getEmployeeName();
    this._authService.user.subscribe((user) => {
      this.getCompanyCode(user.email);
    });
  }

  ngOnInit() {}

  search() {
    this.list = [];
    let newList = [];
    let dataEmployee = [];
    if (this.employeeName.value !== '') {
      dataEmployee = this.names.filter((item) => item.name === this.employeeName.value);
    }
    if (dataEmployee.length === 0) {
      dataEmployee = [{code: '', name: ''}];
    }
    let employeeCode = '';
    if (this.employeeCode.value !== null) {
      employeeCode = this.company + '-' + this.employeeCode.value;
    }
    this._checkTimeService.searchDataByCodeAndNameAndDate(employeeCode, dataEmployee[0].code, this.date.value).subscribe((s) => {
        // เอาไว้นับจำนวนรอบ
        let i = 0;
        s.forEach((ss) => {
          const name = this.names.filter((item) => item.code === ss.val().employee_code);
          newList.push({
            employee_code: ss.val().employee_code.substring(5, 9),
            employee_name: name[0].name,
            dateTime: ss.val().check_in_time,
            imageChecking: ss.val().check_in_photo
          });
          if (newList.length === 6) {
            this.list.push(newList);
            newList = [];
          }
          i++;
          if (s.length === i) {
            this.list.push(newList);
            newList = [];
          }
        });
      });
  }

  // setting set Name CompanyCode And AutoComplete
  getEmployeeName() {
    const name = [];
    this._employeeService.requestData().subscribe((s) => {
      s.forEach((ss) => {
        if (ss.val().resing !== 'Admin' && ss.val().resing !== 'SEFWARE') {
          name.push({code: ss.val().code, name: ss.val().name1});
        }
      });
      this.names = name;
      this.autoComplete();
    });
  }

  autoComplete() {
    this.filteredEmployeeName = this.employeeName.valueChanges
      .pipe(
        startWith(''),
        map((state) => state ? this.filterByEmployeeName(state) : this.names.slice())
      );
  }

  getCompanyCode(email) {
    this._employeeService.requestDataByEmail(email).subscribe((snapshot) => {
      this.company = snapshot[0].company_code;
    });
  }

  filterByEmployeeName(name: string) {
    return this.names.filter((state) =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
}
