import { TestBed } from '@angular/core/testing';

import { MaintenanceArquiveService } from './maintenance-arquive.service';

describe('MaintenanceArquiveService', () => {
  let service: MaintenanceArquiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceArquiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
