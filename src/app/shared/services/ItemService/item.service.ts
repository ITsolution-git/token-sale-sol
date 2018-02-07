import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';

@Injectable()
export class ItemService {

  constructor(
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) { }

  getItems(limit: number = 0, page: number = 1) {
    return this.http.get(
      this.apiRoutingService.getItemsUrl(),
      {
        page,
        limit
      },
      true,
      null
    );
  }

  getItem(id) {
    return this.http.get(
      this.apiRoutingService.getItemUrl(id),
      {},
      true,
      null
    );
  }
}
