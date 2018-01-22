import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeLeaveComponent } from './take-leave.component';

describe('TakeLeaveComponent', () => {
  let component: TakeLeaveComponent;
  let fixture: ComponentFixture<TakeLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
