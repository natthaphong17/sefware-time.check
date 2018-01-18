/*<reference path="../../../../node_modules/@angular/common/src/pipes/date_pipe.d.ts"/>*/
import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Language} from 'angular-l10n';
import {TdMediaService} from '@covalent/core';
import {LogsService} from './logs.service';
import {LogGroups} from './logs';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-logs--dialog',
  templateUrl: './logs-dialog.component.html',
  styleUrls: ['./logs-dialog.component.scss'],
  providers: [LogsService],
})
export class LogsDialogComponent implements OnInit, AfterViewInit {
  @Language() lang: string;

  error: any;
  menu: string = '-';
  path: string;
  ref: string;
  loading: boolean;

  data: LogGroups[] = [];
  temp = [];

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: any,
              private _logsService: LogsService,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {
    if (md_data) {
      this.menu = this.md_data.menu;
      this.path = this.md_data.path;
      this.ref = this.md_data.ref;
    }
  }

  ngOnInit() {
    // console.log('menu ' + this.menu);
    // console.log('path ' + this.path);
    // console.log('ref ' + this.ref);
    this.loading = true;

    if (!this.ref) {
      console.log('เจอ');
      this._logsService.requestData(this.path).subscribe((snapshot) => {
        this._logsService.rows = [];
        snapshot.forEach((s) => {
          this._logsService.rows.push(s.val());
        });

        this.temp = [...this._logsService.rows];
        this.filter();
        this.loading = false;
      });
    }else {
      console.log('N เจอ');
      this._logsService.requestDataByRef(this.path, this.ref).subscribe((snapshot) => {
        this._logsService.rows = [];
        snapshot.forEach((s) => {
          this._logsService.rows.push(s.val());
        });

        this.temp = [...this._logsService.rows];
        this.filter();
        this.loading = false;
      });
    }
  }

  ngAfterViewInit(): void {
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  filter(): void {
    if (!this.loading) {
      this.loading = true;
    }

    this.data = [];
    this.temp.forEach((row) => {
      console.log('row : ' + row);
      const datetime = new DatePipe('En').transform(row.datetime, 'dd/MM/yyyy');
      if (this.data.filter((s) => s.date === datetime).length === 0) {
        this.data.push({
          date: datetime,
          logs_list: []
        });
      }

      this.data.filter((s) => s.date === datetime)[0].logs_list.push(row);
    });

    this.data.reverse();
    this.data.forEach((s) => {
      s.logs_list.reverse();
    });

  }
}
