import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTimeComponent } from './check-time.component';

describe('CheckTimeComponent', () => {
  let component: CheckTimeComponent;
  let fixture: ComponentFixture<CheckTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
