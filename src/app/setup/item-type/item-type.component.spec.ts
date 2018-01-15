import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {ItemTypeComponent} from './item-type.component';

describe('ItemTypeComponent', () => {
  let component: ItemTypeComponent;
  let fixture: ComponentFixture<ItemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
