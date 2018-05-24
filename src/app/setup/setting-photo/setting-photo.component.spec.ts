import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingNetworkLocalComponent } from './setting-network-local.component';

describe('SettingNetworkLocalComponent', () => {
  let component: SettingNetworkLocalComponent;
  let fixture: ComponentFixture<SettingNetworkLocalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingNetworkLocalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingNetworkLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
