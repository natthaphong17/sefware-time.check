import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeDialogComponent } from './employee-type-dialog.component';

describe('EmployeeTypeDialogComponent', () => {
  let component: EmployeeTypeDialogComponent;
  let fixture: ComponentFixture<EmployeeTypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
