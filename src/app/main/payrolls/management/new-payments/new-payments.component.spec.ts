import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaymentsComponent } from './new-payments.component';

describe('NewPaymentsComponent', () => {
  let component: NewPaymentsComponent;
  let fixture: ComponentFixture<NewPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
