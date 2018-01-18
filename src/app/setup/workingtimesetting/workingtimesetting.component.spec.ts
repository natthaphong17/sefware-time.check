import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingtimesettingComponent } from './workingtimesetting.component';

describe('WorkingtimesettingComponent', () => {
  let component: WorkingtimesettingComponent;
  let fixture: ComponentFixture<WorkingtimesettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingtimesettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingtimesettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
