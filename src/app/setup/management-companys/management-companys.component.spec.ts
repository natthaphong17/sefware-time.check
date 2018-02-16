import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementCompanysComponent } from './management-companys.component';

describe('ManagementCompanysComponent', () => {
  let component: ManagementCompanysComponent;
  let fixture: ComponentFixture<ManagementCompanysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementCompanysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementCompanysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
