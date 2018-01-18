import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTimePerviewComponent } from './working-time-perview.component';

describe('WorkingTimePerviewComponent', () => {
  let component: WorkingTimePerviewComponent;
  let fixture: ComponentFixture<WorkingTimePerviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingTimePerviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingTimePerviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
