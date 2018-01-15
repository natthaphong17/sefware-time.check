import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupDialogComponent } from './item-group-dialog.component';

describe('ItemGroupDialogComponent', () => {
  let component: ItemGroupDialogComponent;
  let fixture: ComponentFixture<ItemGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
