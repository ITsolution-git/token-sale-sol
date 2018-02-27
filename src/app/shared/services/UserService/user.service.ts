import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  constructor(
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
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

  retrieveUserID(userID) {
    return this.http.get(
      this.apiRoutingService.getUserUrl(userID),
      {},
      false,
      null
    );
  }

  updateUser(userId, data) {
    return this.http.patch(
      this.apiRoutingService.getUserUrl(userId),
      data,
      false,
      null
    );
  }

  saveTransaction(userId, txData) {
   return this.http.put(
     this.apiRoutingService.saveTxUrl(userId),
     txData,
     false,
     null
   );
  }
}
