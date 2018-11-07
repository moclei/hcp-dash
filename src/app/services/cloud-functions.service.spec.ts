import { TestBed, inject } from '@angular/core/testing';

import { CloudFunctionsService } from './cloud-functions.service';

describe('CloudFunctionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloudFunctionsService]
    });
  });

  it('should be created', inject([CloudFunctionsService], (service: CloudFunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
