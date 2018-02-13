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

  getUsers(limit: number = 0) {
    return this.http.get(
      this.apiRoutingService.getUsersUrl(),
      {
        limit
      },
      false,
      null
    );
  }

  registerUser(data) {
    return this.http.put(
      this.apiRoutingService.getUsersUrl(),
      data,
      false,
      null
    );
  }

  retriveUser(address): Observable<User> {
    return this.http.get(
      this.apiRoutingService.getUserUrl(address),
      {},
      false,
      null
    );
  }
}
