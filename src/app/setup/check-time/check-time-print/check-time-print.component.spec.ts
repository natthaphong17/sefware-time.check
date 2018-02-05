import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTimePrintComponent } from './check-time-print.component';

describe('CheckTimePrintComponent', () => {
  let component: CheckTimePrintComponent;
  let fixture: ComponentFixture<CheckTimePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckTimePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckTimePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
