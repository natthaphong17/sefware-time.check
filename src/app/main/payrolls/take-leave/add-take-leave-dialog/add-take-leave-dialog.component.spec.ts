import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTakeLeaveDialogComponent } from './add-take-leave-dialog.component';

describe('AddTakeLeaveDialogComponent', () => {
  let component: AddTakeLeaveDialogComponent;
  let fixture: ComponentFixture<AddTakeLeaveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTakeLeaveDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTakeLeaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
