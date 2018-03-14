import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import { UserLocalstorageRepository } from './user.localstorage.repository.service';

@Injectable()
export class UserService {

  constructor(
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService,
    private userLocalStorageRepository: UserLocalstorageRepository
  ) { }

  registerUser(data) {
    return this.http.put(
      this.apiRoutingService.getUsersUrl(),
      data,
      false,
      null
    );
  }

  retrieveUser(walletAddress) {
    return this.http.get(
      this.apiRoutingService.getUsersUrl() + '?wallet=' + walletAddress,
      {},
      false,
      null
    );
  }

  updateUser(userId, data) {
    this.userLocalStorageRepository.setUserId(userId);
    return this.http.patch(
      this.apiRoutingService.getUserUrl(userId),
      data
    );
  }

  saveTransaction(userId, txData) {
   return this.http.patch(
     this.apiRoutingService.getUserUrlFromID(userId),
     txData,
     false,
     null
   );
  }
}
