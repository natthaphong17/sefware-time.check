import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeAdminComponent } from './add-employee-admin.component';

describe('AddEmployeeAdminComponent', () => {
  let component: AddEmployeeAdminComponent;
  let fixture: ComponentFixture<AddEmployeeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
