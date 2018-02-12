import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sps110Component } from './sps110.component';

describe('Sps110Component', () => {
  let component: Sps110Component;
  let fixture: ComponentFixture<Sps110Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sps110Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sps110Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
