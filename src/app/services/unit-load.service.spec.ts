import { TestBed, inject } from '@angular/core/testing';

import { UnitLoadService } from './unit-load.service';

describe('UnitLoadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitLoadService]
    });
  });

  it('should be created', inject([UnitLoadService], (service: UnitLoadService) => {
    expect(service).toBeTruthy();
  }));
});
