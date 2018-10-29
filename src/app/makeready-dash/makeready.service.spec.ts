import { TestBed, inject } from '@angular/core/testing';

import { MakeReadyService } from './makeready.service';

describe('MakereadyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MakeReadyService]
    });
  });

  it('should be created', inject([MakeReadyService], (service: MakeReadyService) => {
    expect(service).toBeTruthy();
  }));
});
