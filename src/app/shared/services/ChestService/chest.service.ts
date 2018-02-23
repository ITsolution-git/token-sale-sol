import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';

@Injectable()
export class ChestService {

  constructor(
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) { }

  getChest(id) {
    return this.http.get(
      this.apiRoutingService.getChestUrl(id),
      {},
      true,
      null
    );
  }

  unlockChest(id, data) {
    return this.http.patch(
      this.apiRoutingService.getChestUrl(id),
      data,
      true,
      null
    )
  }
  
  getChestDataFromID(id) {
    return this.http.get(
      this.apiRoutingService.getChestDataFromID(id),
      {},
      true,
      null
    );
  }
}
