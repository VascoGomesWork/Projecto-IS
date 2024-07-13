import { TestBed } from '@angular/core/testing';

import { ParkListServiceService } from './park-list-service.service';

describe('ParkListServiceService', () => {
  let service: ParkListServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkListServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
