import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import {
  CovalentChipsModule,
  CovalentCommonModule,
  CovalentDataTableModule,
  CovalentDialogsModule,
  CovalentExpansionPanelModule,
  CovalentFileModule,
  CovalentJsonFormatterModule,
  CovalentLayoutModule,
  CovalentLoadingModule,
  CovalentMediaModule,
  CovalentMenuModule,
  CovalentMessageModule,
  CovalentNotificationsModule,
  CovalentPagingModule,
  CovalentSearchModule,
  CovalentVirtualScrollModule
} from '@covalent/core';

import {CovalentHighlightModule} from '@covalent/highlight';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

const FLEX_LAYOUT_MODULES: any[] = [
  FlexLayoutModule,
];

const ANGULAR_MODULES: any[] = [
  FormsModule,
  ReactiveFormsModule,

  NgxDatatableModule,
];

const MATERIAL_MODULES: any[] = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatInputModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatTabsModule,
  MatSelectModule,
  MatDialogModule,
  MatProgressBarModule,
  MatChipsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatRadioModule,
  MatAutocompleteModule
];

const COVALENT_MODULES: any[] = [
  CovalentDataTableModule,
  CovalentMediaModule,
  CovalentLoadingModule,
  CovalentNotificationsModule,
  CovalentLayoutModule,
  CovalentMenuModule,
  CovalentPagingModule,
  CovalentSearchModule,
  CovalentCommonModule,
  CovalentDialogsModule,
  CovalentHighlightModule,
  CovalentMessageModule,
  CovalentFileModule,
  CovalentChipsModule,
  CovalentJsonFormatterModule,
  CovalentExpansionPanelModule,
  CovalentVirtualScrollModule
];

@NgModule({
  imports: [
    CommonModule,
    ANGULAR_MODULES,
    MATERIAL_MODULES,
    COVALENT_MODULES,
    FLEX_LAYOUT_MODULES,
  ],
  declarations: [
  ],
  exports: [
    ANGULAR_MODULES,
    MATERIAL_MODULES,
    COVALENT_MODULES,
    FLEX_LAYOUT_MODULES,
  ], providers: [

  ],
})
export class SharedModule {
}
