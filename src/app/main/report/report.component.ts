import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Language, LocaleService} from 'angular-l10n';
import {TdMediaService} from '@covalent/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewInit {
  @Language() lang: string;

  constructor(public locale: LocaleService,
              public router: Router,
              private _changeDetectorRef: ChangeDetectorRef,
              public media: TdMediaService) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.media.broadcast();
    this._changeDetectorRef.detectChanges();
  }
}
