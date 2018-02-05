import {Component, Inject, OnInit} from '@angular/core';
import {ManagementComponent} from '../management.component';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ManagementService} from '../management.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-payments',
  templateUrl: './new-payments.component.html',
  styleUrls: ['./new-payments.component.scss'],
  providers: [ManagementService]
})
export class NewPaymentsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)  private _management: ManagementComponent,
              private location: Location,
              private _managementService: ManagementService) {

  }

  ngOnInit() {
  }

  upDatePaymentStatus() {
    this._managementService.requestEmployeeData().subscribe((emp) => {
      emp.forEach((e) => {
        this._managementService.updatePayStatus(e.val());
      });
    });
    location.reload();
  }

}
