import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pjd1Component } from './pjd1.component';

describe('Pjd1Component', () => {
  let component: Pjd1Component;
  let fixture: ComponentFixture<Pjd1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pjd1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pjd1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
