import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSubGroupComponent } from './item-sub-group.component';

describe('ItemSubGroupComponent', () => {
  let component: ItemSubGroupComponent;
  let fixture: ComponentFixture<ItemSubGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSubGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSubGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
