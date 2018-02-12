import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sps609Component } from './sps609.component';

describe('Sps609Component', () => {
  let component: Sps609Component;
  let fixture: ComponentFixture<Sps609Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sps609Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sps609Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
