import {Component, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../shared/model/page';
import {Language} from 'angular-l10n';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LogsService} from '../../dialog/logs-dialog/logs.service';
import {CheckTimePreviewComponent} from './check-time-preview/check-time-preview.component';
import {EmployeeTypeService} from '../employee/employee-type.service';
import {EmployeeType} from '../employee/employee-type';

@Component({
  selector: 'app-check-time',
  templateUrl: './check-time.component.html',
  styleUrls: ['./check-time.component.scss'],
  providers: [EmployeeTypeService, LogsService]
})
export class CheckTimeComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private dialog: MatDialog,
              public snackBar: MatSnackBar,
              private _logService: LogsService,
              private _employeeService: EmployeeTypeService) {
    this.page.size = 10;
    this.page.pageNumber = 0; }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this._employeeService.requestData().subscribe((snapshot) => {
      this._employeeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new EmployeeType(s.val());
        this._employeeService.rows.push(_row);

      });

      this.temp = [...this._employeeService.rows];
      this.loading = false;
      this.setPage(null);
    });

  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._employeeService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }
  openWorkingTimePreview(data: EmployeeType) {
    this.dialog.open(CheckTimePreviewComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        name: data.name1,
        path: this._employeeService.getPath(),
        ref: data ? data.id : null
      },
    });
  }

}
