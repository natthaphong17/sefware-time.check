import {Component, Inject, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HolidaysService } from '../holidays.service';
import { Holidays } from '../holidays';
import {LogsService} from '../../../dialog/logs-dialog/logs.service';
import {Language} from 'angular-l10n';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TdLoadingService} from '@covalent/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-holidays-dialog',
  templateUrl: './holidays-dialog.component.html',
  styleUrls: ['./holidays-dialog.component.scss'],
  providers: [HolidaysService, LogsService]
})
export class HolidaysDialogComponent implements OnInit {
  @Language() lang: string;

  disableSelect = new FormControl(true);
  data: Holidays = new Holidays({});

  error: any;
  images = [];

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: Holidays,
              private _holidaysService: HolidaysService,
              public dialogRef: MatDialogRef<HolidaysDialogComponent>,
              private _loadingService: TdLoadingService) {
    try {
      if (md_data) {
        this.data = new Holidays(md_data);
        this.disableSelect = new FormControl(this.data.disableSelect);
        /*if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }*/

      } else {
        // this.displayImage('../../../../../assets/images/user.png');
        this._holidaysService.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit() {
  }

  generateCode() {
    this._loadingService.register('data.form');
    // const prefix = 'TYPE';
    // this.data.code = prefix + '-001';
    this.data.code = '1';
    this._holidaysService.requestLastData().subscribe((s) => {
      s.forEach((ss: Holidays) => {
        console.log('Prev Code :' + ss.code );
        // tslint:disable-next-line:radix
        const str = parseInt(ss.code.substring(ss.code.length - 1, ss.code.length)) + 1;
        const last = '' + str;

        /*let last = prefix + '-' + str;

        if (str < 100) {
          last = prefix + '-0' + str;
        }

        if (str < 10) {
          last = prefix + '-00' + str;
        }*/

        this.data.code = last;
      });
      this._loadingService.resolve('data.form');
    });
  }

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      this.data.name1 = form.value.name1 ? form.value.name1 : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
        } else {
          this._holidaysService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._holidaysService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }

}
