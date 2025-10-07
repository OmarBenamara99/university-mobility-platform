import { TestBed } from '@angular/core/testing';

import { MobilityProcessService } from './mobility-process.service';

describe('MobilityProcessService', () => {
  let service: MobilityProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobilityProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
