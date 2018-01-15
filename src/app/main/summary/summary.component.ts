import {Component, OnInit} from '@angular/core';
import {Language, LocaleService} from 'angular-l10n';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  @Language() lang: string;

  constructor(public locale: LocaleService) {
  }

  ngOnInit() {
  }

}
