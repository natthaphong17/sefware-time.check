import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Language} from 'angular-l10n';
import {ConfirmComponent} from '../../../dialog/confirm/confirm.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../../shared/model/page';
import {TdMediaService} from '@covalent/core';
import {LogsService} from '../../../dialog/logs-dialog/logs.service';
import {Logs} from '../../../dialog/logs-dialog/logs';
import {LogsDialogComponent} from '../../../dialog/logs-dialog/logs-dialog.component';
import {ManagementService} from './management.service';
import {Management, TakeLeave} from './management';
import {__await} from 'tslib';

@Component({
  selector: 'app-payrolls-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
  providers: [ManagementService]
})
export class ManagementComponent implements OnInit, AfterViewInit {

  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};
  rows: any[] = [];
  temp = [];
  test = [];
  take_leave = [];
  take_leave_data = [];
  year_now = new Date();

  constructor(private _managementService: ManagementService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _logService: LogsService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {

    this.page.size = 50;
    this.page.pageNumber = 0;

  }

  ngOnInit(): void {
    this.load();
    // this.loadTakeLeaveData();
  }

  ngAfterViewInit(): void {
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  load() {
    this.loading = true;
    this._managementService.requestData().subscribe((snapshot) => {
      this._managementService.rows = [];
      snapshot.forEach((s) => {
        const _row = new Management(s.val());
        this._managementService.requestTakeLeaveData(s.val().code).subscribe((take_leave) => {
          take_leave.forEach((leave) => {
            console.log('Lsifdffssfs: ' + leave.end_leave);
            let cal_date_leave: number = 0;
            const start = new Date(leave.start_leave);
            const end = new Date(leave.end_leave);

            cal_date_leave = (end.getDate() - start.getDate()) + 1;
            if (leave.take_leave === 'Sick Leave') {
              if (leave.disable === true) {
                _row.sick_leave = _row.sick_leave + cal_date_leave;
              }
            } else if (leave.take_leave === 'Business Leave') {
              _row.bussiness_leave = cal_date_leave;
            } else if (leave.take_leave === 'Holidays') {
              _row.holiday = cal_date_leave;
            } else if (leave.take_leave === 'Vacations') {
              _row.vacation = cal_date_leave;
            }
          });
          this._managementService.rows.push(_row);
          console.log(' _row : ' +  JSON.stringify(_row));
          this.returnRowsData();
        });
      });
    });

    this.temp = [...this._managementService.rows];
    console.log(' this.temp : ' +  JSON.stringify(this.temp));
    console.log('test1 ..... ');
    this.loading = false;
    this.setPage(null);
  }

 /* loadTakeLeaveData() {
    this.loading = true;
    this._managementService.requestTakeLeaveData().subscribe((snapshot) => {
      this._managementService.takes = [];
      snapshot.forEach((s) => {

        const _row = new TakeLeave(s.val());
        this._managementService.takes.push(_row);

      });

      this.take_leave = [...this._managementService.takes];
      // console.log('test2 ..... ' +  JSON.stringify(this.take_leave));
      console.log('test3 ..... ' +  this.year_now.getDate());
      // this.takeLeaveData(this.temp);
      this.loading = false;
      this.setPage(null);
    });
  }*/

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._managementService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    /*const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.addLog('Create', 'create driver succeed', result, {});
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });*/
  }

  editData(data: Management) {
    /*const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '100%',
      height: '100%',
      data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.addLog('Update', 'update driver succeed', result, data);
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });*/
  }

  deleteData(data: Management) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete comparison',
        content: 'Confirm to delete?',
        data_title: 'Comparison',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._managementService.removeData(data).then(() => {
          this.snackBar.open('Delete comparison succeed', '', {duration: 3000});
          this.addLog('Delete', 'delete comparison succeed', data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  enableData(data: Management) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'enable',
        title: 'Enable comparison',
        content: 'Comparison with enabled will be able to use',
        data_title: 'Comparison',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._managementService.updateDataStatus(data, false).then(() => {
          this.snackBar.open('Enable comparison succeed', '', {duration: 3000});

          const new_data = new Management(data);
          // new_data.disable = false;
          this.addLog('Enable', 'enable comparison succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });

  }

  disableData(data: Management) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'disable',
        title: 'Disable comparison',
        content: 'Comparison with disabled are not able to use',
        data_title: 'Comparison',
        data: data.code + ' : ' + data.name1
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._managementService.updateDataStatus(data, true).then(() => {
          this.snackBar.open('Disable comparison succeed', '', {duration: 3000});

          const new_data = new Management(data);
          // new_data.disable = false;
          this.addLog('Disable', 'Disable comparison succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  openLogs(data: Management) {
    this.dialog.open(LogsDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Comparison',
        path: this._managementService.getPath(),
        ref: data ? data.code : null
      },
    });
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._managementService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._managementService.getPath(), log);
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
        (d.name && d.name.toLowerCase().indexOf(val) !== -1)
        || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  returnRowsData() {
    this.temp = [...this._managementService.rows];
    console.log(' this.temp : ' +  JSON.stringify(this.temp));
    console.log('test211 ..... ');
    this.loading = false;
    this.setPage(null);
  }

  takeLeaveData(take_leave) {
    take_leave.forEach( (take_leave_push) => {
      this.take_leave_data.push(take_leave_push);
    });
  }
}
