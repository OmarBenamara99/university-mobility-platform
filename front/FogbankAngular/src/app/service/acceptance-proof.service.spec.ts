import { TestBed } from '@angular/core/testing';

import { AcceptanceProofService } from './acceptance-proof.service';

describe('AcceptanceProofService', () => {
  let service: AcceptanceProofService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceptanceProofService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
