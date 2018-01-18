import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiveComponent } from './goods-receive.component';

describe('GoodsReceiveComponent', () => {
  let component: GoodsReceiveComponent;
  let fixture: ComponentFixture<GoodsReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
