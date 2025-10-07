import { TestBed } from '@angular/core/testing';

import { AdministrativeFileServiceService } from './administrative-file-service.service';

describe('AdministrativeFileServiceService', () => {
  let service: AdministrativeFileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministrativeFileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
