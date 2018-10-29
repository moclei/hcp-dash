import { TestBed, inject } from '@angular/core/testing';

import { SheetsModel } from './directory.service';

describe('SheetsModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SheetsModel]
    });
  });

  it('should be created', inject([SheetsModel], (service: SheetsModel) => {
    expect(service).toBeTruthy();
  }));
});
