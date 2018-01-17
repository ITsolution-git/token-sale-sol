import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../http-helper.service';
import { ApiRoutingService } from '../../api-routing.service';

@Injectable()
export class ItemService {

  constructor(
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) { }

  getItems() {
    return this.http.get(
      this.apiRoutingService.getItemsUrl(),
      {},
      true,
      null
    );
  }
}
