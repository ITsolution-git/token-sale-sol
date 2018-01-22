import { TestBed, inject } from '@angular/core/testing';

import { MetaMaskService } from './meta-mask.service';

describe('MetaMaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetaMaskService]
    });
  });

  it('should be created', inject([MetaMaskService], (service: MetaMaskService) => {
    expect(service).toBeTruthy();
  }));
});
