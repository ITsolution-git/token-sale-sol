import { TestBed, inject } from '@angular/core/testing';

import { HttpHelperService } from './http-helper.service';
import { HttpModule } from '@angular/http';
import { LocalStorageService } from 'ngx-webstorage';

describe('HttpHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [HttpHelperService, LocalStorageService]
    });
  });

  it(
    'should be created',
    inject([HttpHelperService], (service: HttpHelperService) => {
      expect(service).toBeTruthy();
    })
  );
});
