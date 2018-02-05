import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {CheckTime} from '../check-time';
import {PrintingService} from '../printing-service.service';
import {CheckTimeComponent} from '../check-time.component';

@Component({
  selector: 'app-check-time-print',
  templateUrl: './check-time-print.component.html',
  styleUrls: ['./check-time-print.component.scss'],
  providers: [PrintingService]
})
export class CheckTimePrintComponent implements OnInit {

  name: string = '';
  timeGood: string = '';
  timeLate: string = '';
  timeGross: string = '';
  data: CheckTime = new CheckTime({});

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: any,
              private dialog: MatDialog,
              private printingService: PrintingService) {
    if (md_data) {
      this.name = this.md_data.nameEmployee;
      this.timeGood = this.md_data.timeGood;
      this.timeLate = this.md_data.timeLate;
      this.timeGross = this.md_data.timeGross;
      this.data = this.md_data.data;
    }
  }

  ngOnInit() {
    console.log(this.name);
    console.log(this.timeGood);
    console.log(this.timeLate);
    console.log(this.timeGross);
    console.log(this.data);
  }
  print(printId: string) {
    const styles  = 'table {border-collapse: collapse;width: 90%;} ' +
      'th, td {text-align: left;padding: 8px;} ' +
      'tr:nth-child(even){background-color: #f2f2f2} ' +
      'label {padding: 0 15px;font-size: 20px;}';
    this.printingService.print(printId, 'report', styles);
    this.checkTime();
  }

  checkTime() {
    this.dialog.open(CheckTimeComponent, {
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
    });
  }

}
