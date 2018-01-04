import { TestBed, inject } from '@angular/core/testing';

import { ApiRoutingService } from './api-routing.service';

describe('ApiRoutingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiRoutingService],
    });
  });

  it(
    'should be created',
    inject([ApiRoutingService], (service: ApiRoutingService) => {
      expect(service).toBeTruthy();
    })
  );
});
