import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sps1031Component } from './sps1031.component';

describe('Sps1031Component', () => {
  let component: Sps1031Component;
  let fixture: ComponentFixture<Sps1031Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sps1031Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sps1031Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
