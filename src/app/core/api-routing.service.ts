import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiRoutingService {
  private baseUrl = environment.BASE_API_URL;

  constructor() {}

  getItemsUrl() {
    // return this.baseUrl + '/items';
    return '../../../assets/items.json';
  }
  getMetaCoinUrl() {
    return '/contracts/MetaCoin.json';
  }
}
