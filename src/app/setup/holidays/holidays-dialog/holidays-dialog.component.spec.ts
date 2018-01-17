import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysDialogComponent } from './holidays-dialog.component';

describe('HolidaysDialogComponent', () => {
  let component: HolidaysDialogComponent;
  let fixture: ComponentFixture<HolidaysDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidaysDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaysDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
