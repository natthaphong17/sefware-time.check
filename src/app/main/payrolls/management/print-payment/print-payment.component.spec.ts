import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPaymentComponent } from './print-payment.component';

describe('PrintPaymentComponent', () => {
  let component: PrintPaymentComponent;
  let fixture: ComponentFixture<PrintPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
