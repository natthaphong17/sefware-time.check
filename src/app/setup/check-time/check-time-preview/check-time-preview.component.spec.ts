import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTimePreviewComponent } from './check-time-preview.component';

describe('CheckTimePreviewComponent', () => {
  let component: CheckTimePreviewComponent;
  let fixture: ComponentFixture<CheckTimePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckTimePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckTimePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
