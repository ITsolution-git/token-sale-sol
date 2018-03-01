import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiRoutingService {
  private baseUrl = environment.BASE_API_URL;

  constructor() { }

  getItemsUrl() {
    return this.baseUrl + '/item';
  }

  getItemsUrl_ID(ids) {
    let url = this.baseUrl + '/item?limit=0';
    for (const id of ids) {
      url += '&list[]=' + id;
    }

    return url;
  }

  getItemUrl(id) {
    return this.baseUrl + '/item/' + id;
  }

  saveTxUrl(id) {
    return this.baseUrl + '/user/' + id + '/transactions';
  }

  getMetaCoinUrl() {
    return '/contracts/MetaCoin.json';
  }

  getChestUrl() {
    return this.baseUrl + '/chest';
  }

  getChestUrlFromID(id) {
    return this.baseUrl + '/chest/' + id;
  }

  getUsersUrl() {
    return this.baseUrl + '/user';
  }

  getUserUrlFromID(id) {
    return this.baseUrl + '/user/' + id;
  }

  getUserUrl(userId) {
    return this.baseUrl + '/user/' + userId;
  }

  loadUnityPlayerUrl() {
    return this.baseUrl + '/unity';
  }
}
