import { TestBed, inject } from '@angular/core/testing';

import { GoogleHttpService } from './google-http.service';

describe('GoogleHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleHttpService]
    });
  });

  it('should be created', inject([GoogleHttpService], (service: GoogleHttpService) => {
    expect(service).toBeTruthy();
  }));
});
