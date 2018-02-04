import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiRoutingService {
  private baseUrl = environment.BASE_API_URL;

  constructor() {}

  getItemsUrl() {
    return this.baseUrl + '/item';
    // return '../../../assets/items.json';
  }

  getMetaCoinUrl() {
    return '/contracts/MetaCoin.json';
  }

  getChestUrl() {
    // return this.baseUrl + '/chest';
    return '../../../assets/chestId.json';
  }

  getChestDataFromID(id) {
    // return this.baseUrl + `/chest/${id}`;
    return '../../../assets/chest.json';
  }
}
