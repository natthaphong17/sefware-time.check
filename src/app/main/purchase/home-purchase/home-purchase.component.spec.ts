import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePurchaseComponent } from './home-purchase.component';

describe('HomePurchaseComponent', () => {
  let component: HomePurchaseComponent;
  let fixture: ComponentFixture<HomePurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
