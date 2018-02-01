import { TestBed, inject } from '@angular/core/testing';

import { ChestService } from './chest.service';

describe('ChestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChestService]
    });
  });

  it('should be created', inject([ChestService], (service: ChestService) => {
    expect(service).toBeTruthy();
  }));
});
