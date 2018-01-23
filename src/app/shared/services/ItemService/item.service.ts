import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';

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

  getItem(id) {
    return this.http.get(
      this.apiRoutingService.getItemsUrl(),
      {},
      true,
      null
    )
    .map(items => items.find(item => item.id === id));
  }
}
