import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkListDetailsComponent } from './park-list-details.component';

describe('ParkListDetailsComponent', () => {
  let component: ParkListDetailsComponent;
  let fixture: ComponentFixture<ParkListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkListDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
