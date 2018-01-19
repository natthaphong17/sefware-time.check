import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {Language} from 'angular-l10n';
import {Page} from '../../../shared/model/page';
import {CheckTime} from '../check-time';
import {CheckTimeDialogComponent} from './check-time-dialog/check-time-dialog.component';

@Component({
  selector: 'app-check-time-preview',
  templateUrl: './check-time-preview.component.html',
  styleUrls: ['./check-time-preview.component.scss']
})
export class CheckTimePreviewComponent implements OnInit {
  @Language() lang: string;

  loading: boolean = true;

  name: string = '-';
  path: string;
  ref: string;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: any,
              private dialog: MatDialog) {
    this.page.size = 10;
    this.page.pageNumber = 0;
    if (md_data) {
      this.name = this.md_data.name;
      this.path = this.md_data.path;
      this.ref = this.md_data.ref;
    }
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    // this._checkTimeService.requestData().subscribe((snapshot) => {
    //   this._checkTimeService.rows = [];
    //   snapshot.forEach((s) => {
    //
    //     const _row = new CheckTime(s.val());
    //     this._checkTimeService.rows.push(_row);
    //
    //   });
    //
    //   this.temp = [...this._checkTimeService.rows];
    //   this.loading = false;
    this.setPage(null);
    // });

  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    // this._checkTimeService.getResults(this.page).subscribe((pagedData) => {
    //   this.page = pagedData.page;
    //   this.rows = pagedData.data;
    // });

  }

}
