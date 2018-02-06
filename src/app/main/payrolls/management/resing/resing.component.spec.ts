import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResingComponent } from './resing.component';

describe('ResingComponent', () => {
  let component: ResingComponent;
  let fixture: ComponentFixture<ResingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
