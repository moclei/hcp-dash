import { TestBed, inject } from '@angular/core/testing';

import { DashService } from './dash-service.service';

describe('DashServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashService]
    });
  });

  it('should be created', inject([DashService], (service: DashService) => {
    expect(service).toBeTruthy();
  }));
});
