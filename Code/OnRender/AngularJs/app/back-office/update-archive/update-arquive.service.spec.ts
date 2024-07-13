import { TestBed } from '@angular/core/testing';

import { UpdateArquiveService } from './update-arquive.service';

describe('UpdateArquiveService', () => {
  let service: UpdateArquiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateArquiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
