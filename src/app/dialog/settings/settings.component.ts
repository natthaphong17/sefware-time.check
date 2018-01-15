import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  data: any;

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: any) {
    console.log(md_data);
    this.data = md_data;
  }

}
