import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSubGroupDialogComponent } from './item-sub-group-dialog.component';

describe('ItemSubGroupDialogComponent', () => {
  let component: ItemSubGroupDialogComponent;
  let fixture: ComponentFixture<ItemSubGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSubGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSubGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
