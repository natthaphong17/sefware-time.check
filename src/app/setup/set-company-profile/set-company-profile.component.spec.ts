import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCompanyProfileComponent } from './set-company-profile.component';

describe('SetCompanyProfileComponent', () => {
  let component: SetCompanyProfileComponent;
  let fixture: ComponentFixture<SetCompanyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetCompanyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCompanyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
