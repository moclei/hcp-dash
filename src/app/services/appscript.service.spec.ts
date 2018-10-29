import { TestBed, inject } from '@angular/core/testing';

import { AppscriptService } from './appscript.service';

describe('AppscriptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppscriptService]
    });
  });

  it('should be created', inject([AppscriptService], (service: AppscriptService) => {
    expect(service).toBeTruthy();
  }));
});
