import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingtimesettingTypeDialogComponent } from './workingtimesetting-type-dialog.component';

describe('WorkingtimesettingTypeDialogComponent', () => {
  let component: WorkingtimesettingTypeDialogComponent;
  let fixture: ComponentFixture<WorkingtimesettingTypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingtimesettingTypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingtimesettingTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
