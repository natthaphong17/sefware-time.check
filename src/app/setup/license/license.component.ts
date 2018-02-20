import {Component, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../shared/model/page';
import {Language} from 'angular-l10n';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {SelectionModel} from '@angular/cdk/collections';
import { LogsDialogComponent } from '../../dialog/logs-dialog/logs-dialog.component';
import { Logs } from '../../dialog/logs-dialog/logs';
import { LogsService } from '../../dialog/logs-dialog/logs.service';
import {AuthService} from '../../login/auth.service';
import {LicenseService} from './license.service';
import {License} from './license';
import {AddLicenseComponent} from './add-license/add-license.component';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
  providers: [LicenseService, LogsService, AuthService]
})
export class LicenseComponent implements OnInit {
  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  // expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _licenseService: LicenseService,
              private _logService: LogsService,
              private _authService: AuthService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {

    this.page.size = 20;
    this.page.pageNumber = 0;

  }
  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this._licenseService.requestData().subscribe((snapshot) => {
      this._licenseService.rows = [];
      snapshot.forEach((s) => {

        const _row = new License(s.val());
        if (s.val().resing !== 'red') {
          this._licenseService.rows.push(_row);
        }
      });

      this.temp = [...this._licenseService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._licenseService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(AddLicenseComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '45%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  // editData(data: ManagementCompanys) {
  //   const dialogRef = this.dialog.open(EmployeeTypeDialogComponent, {
  //     disableClose: true,
  //     maxWidth: '100vw',
  //     maxHeight: '100vw',
  //     width: '75%',
  //     data
  //   });
  //
  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     if (result) {
  //       // this.msgs = [];
  //       // this.msgs.push({severity: 'success', detail: 'Data updated'});
  //     }
  //   });
  // }

  deleteData(data: License) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete employee type',
        content: 'Confirm to delete?',
        data_title: 'Employee Type',
        data: data.code + ' : ' + data.active_status
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._licenseService.removeData(data).then(() => {
          this.snackBar.open('Delete employee type succeed.', '', {duration: 3000});
          this.addLog('Delete', 'delete employee type succeed', data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  updateFilter(event) {
    if (event === '') {
      this.setPage(null);
      return;
    }

    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return (d.code.toLowerCase().indexOf(val) !== -1) ||
        (d.name1 && d.name1.toLowerCase().indexOf(val) !== -1) ||
        (d.name2 && d.name2.toLowerCase().indexOf(val) !== -1)
        || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  openLogs(data: License) {
    this.dialog.open(LogsDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Employee Type',
        path: this._licenseService.getPath(),
        ref: data ? data.code : null
      },
    });
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._licenseService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._licenseService.getPath(), log);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
