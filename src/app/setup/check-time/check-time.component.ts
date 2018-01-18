import {Component, OnInit, ViewChild} from '@angular/core';
import {Page} from '../../shared/model/page';
import {Language} from 'angular-l10n';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LogsService} from '../../dialog/logs-dialog/logs.service';
import {CheckTimeService} from './check-time.service';
import {CheckTime} from './check-time';
import {WorkingTimePerviewComponent} from '../../dialog/working-time-perview/working-time-perview.component';

@Component({
  selector: 'app-check-time',
  templateUrl: './check-time.component.html',
  styleUrls: ['./check-time.component.scss'],
  providers: [CheckTimeService, LogsService]
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
              private _checkTimeService: CheckTimeService) {
    this.page.size = 10;
    this.page.pageNumber = 0; }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this._checkTimeService.requestData().subscribe((snapshot) => {
      this._checkTimeService.rows = [];
      snapshot.forEach((s) => {

        const _row = new CheckTime(s.val());
        this._checkTimeService.rows.push(_row);

      });

      this.temp = [...this._checkTimeService.rows];
      this.loading = false;
      this.setPage(null);
    });

  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._checkTimeService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }
  operWorkingTimePerview(data: CheckTime) {
    this.dialog.open(WorkingTimePerviewComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Item Type',
        path: this._checkTimeService.getPath(),
        ref: data ? data.code : null
      },
    });
  }

}
