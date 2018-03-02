import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySlipComponent } from './pay-slip.component';

describe('PaySlipComponent', () => {
  let component: PaySlipComponent;
  let fixture: ComponentFixture<PaySlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaySlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
