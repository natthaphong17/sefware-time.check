import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLicenseComponent } from './add-license.component';

describe('AddLicenseComponent', () => {
  let component: AddLicenseComponent;
  let fixture: ComponentFixture<AddLicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
