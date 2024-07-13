import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceArchiveComponent } from './maintenance-archive.component';

describe('MaintenanceArchiveComponent', () => {
  let component: MaintenanceArchiveComponent;
  let fixture: ComponentFixture<MaintenanceArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceArchiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
