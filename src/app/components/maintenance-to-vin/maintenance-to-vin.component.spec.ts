import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceToVinComponent } from './maintenance-to-vin.component';

describe('MaintenanceToVinComponent', () => {
  let component: MaintenanceToVinComponent;
  let fixture: ComponentFixture<MaintenanceToVinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceToVinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceToVinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
