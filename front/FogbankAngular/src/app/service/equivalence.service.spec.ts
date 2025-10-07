import { TestBed } from '@angular/core/testing';

import { EquivalenceService } from './equivalence.service';

describe('EquivalenceService', () => {
  let service: EquivalenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquivalenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
