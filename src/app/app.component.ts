import {Component, OnInit} from '@angular/core';
import {Language} from 'angular-l10n';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
  @Language() lang: string;

  constructor(private _iconRegistry: MatIconRegistry,
              private _domSanitizer: DomSanitizer,
              ) {
    this._iconRegistry.addSvgIconInNamespace('assets', 'logo', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/On-time.svg'));
  }

  ngOnInit(): void {
  }

}
