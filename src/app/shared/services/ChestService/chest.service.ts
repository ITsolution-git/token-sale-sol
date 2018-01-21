import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';

@Injectable()
export class ChestService {

  constructor(
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) { }

  getChest() {
    return this.http.get(
      this.apiRoutingService.getChestUrl(),
      {},
      true,
      null
    );
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