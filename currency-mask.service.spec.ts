import { TestBed } from '@angular/core/testing';

import { CurrencyMaskServiceService } from './currency-mask-service.service';

describe('CurrencyMaskServiceService', () => {
  let service: CurrencyMaskServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyMaskServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
