import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiRoutingService {
  private baseUrl = environment.BASE_API_URL;

  constructor() {}

  getItemsUrl() {
    return this.baseUrl + '/item';
  }

  getItemUrl(id) {
    return this.baseUrl + '/item/' + id;
  }

  getMetaCoinUrl() {
    return '/contracts/MetaCoin.json';
  }

  getChestUrl() {
    return '../../../assets/chestId.json';
  }

  getChestDataFromID(id) {
    return '../../../assets/chest.json';
  }

  getUsersUrl() {
    return this.baseUrl + '/user';
  }

  loadUnityPlayerUrl() {
    return this.baseUrl + '/unity';
  }
}
