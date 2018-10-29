import { TestBed, inject } from '@angular/core/testing';

import { ContractorFirebaseService } from './contractor-firebase.service';

describe('ContractorFirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractorFirebaseService]
    });
  });

  it('should be created', inject([ContractorFirebaseService], (service: ContractorFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
