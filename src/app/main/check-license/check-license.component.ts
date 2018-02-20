import { Component, OnInit } from '@angular/core';
import { Inject, ViewEncapsulation } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Language} from 'angular-l10n';
import {AuthService} from '../../login/auth.service';
import {SetCompanyProfile} from '../../setup/set-company-profile/set-company-profile';
import {SetCompanyProfileService} from '../../setup/set-company-profile/set-company-profile.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {LicenseService} from '../../setup/license/license.service';
import { Location } from '@angular/common';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-check-license',
  templateUrl: './check-license.component.html',
  styleUrls: ['./check-license.component.scss'],
  providers: [SetCompanyProfileService, LicenseService],
  encapsulation: ViewEncapsulation.Emulated
})
export class CheckLicenseComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();
  @Language() lang: string;
  data: any;
  alert_active = '';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: any,
              private _setcompanyprofile: SetCompanyProfileService,
              private _licenseService: LicenseService,
              private location: Location,
              public _authService: AuthService) {
    // console.log(md_data);
    this.data = md_data;
  }

  ngOnInit() {
    // this.activeCode();
  }

  logout() {
    this._authService.signout();
  }

  activeCode(data) {
    console.log('Code : ' + data.company);
    console.log('License : ' + data.data_active);
    this._licenseService.requestData().subscribe((snapshot) => {
      snapshot.forEach((s) => {
        console.log('See License : ' + s.val().license);
        if (data.user_active === s.val().license) {
          if (s.val().active_status === 'active') {
            //
          } else {
            console.log('Pass : ' + s.val().license);

            if (s.val().time_length === 'Non Stop') {
              const data_license = { code : s.val().code ,
                time_length : s.val().time_length,
                license : s.val().license,
                time_start : new Date(),
                time_end : 'Non Stop',
                active_status : 'active',
                company_code : data.company
              };
              const data_company = {code : data.company ,
              license : s.val().license};
              this._setcompanyprofile.updateData(data_company);
              this._licenseService.updateData(data_license);
              this.refreshPage();
            } else {
              const timetoday = new Date();

              const time = timetoday.getTime() + (86400000 * s.val().time_length);
              const timeend = new Date(time);

              console.log('Time End : ' + timeend.getDate() + '-' + (timeend.getMonth() + 1) + '-' + timeend.getFullYear());

              const data_license = { code : s.val().code ,
                time_length : s.val().time_length,
                license : s.val().license,
                time_start : new Date(),
                time_end : timeend,
                active_status : 'active',
                company_code : data.company
              };
              const data_company = {code : data.company ,
                license : s.val().license};
              this._setcompanyprofile.updateData(data_company);
              this._licenseService.updateData(data_license);
              this.refreshPage();
            }
          }
        } else {
          console.log('Feil : ' + data.user_active);
          this.alert_active = 'Active Code Feil Please Try Again';
        }
      });
    });
  }

  refreshPage() {
    location.reload();
  }
}
