import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { LocalStorageService } from 'ngx-webstorage';
import { ErrorResponse } from '../shared/models';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpHelperService {
  public serverError = false;

  constructor(
    private router: Router,
    private http: Http,
    private localStorage: LocalStorageService
  ) { }

  private checkAuthHeader(response: Response) {
    let res;
    const authorizationHeader = response.headers.toJSON()['Authorization'] || response.headers.toJSON()['authorization'];
    if (authorizationHeader) {
      this.localStorage.store(environment.localStorage.token, authorizationHeader[0]);
    }
    try {
      res = response.json();
    } catch (e) {
      res = {};
    }
    return res;
  }
  /***
   * generate request options
   * @param isUrlEncoded
   * @param requiredAuth
   * @param customHeader
   * @param customParam
   * @returns {RequestOptions}
   */
  private generateReqOptions(
    isUrlEncoded = false,
    requiredAuth = false,
    customHeader?: Headers,
    customParam?: Object,
    isMultipart = false
  ): RequestOptions {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    const search = new URLSearchParams();

    if (isUrlEncoded) {
      headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
    }

    if (isMultipart) {
      headers = new Headers();
    }

    if (requiredAuth) {
      const token = this.localStorage.retrieve(
        environment.localStorage.token
      );
      headers.append('Authorization', `${token}`);
    }

    if (customHeader) {
      customHeader.forEach((value, key) => {
        headers.append(key, value[0]);
      });
    }

    if (customParam) {
      // tslint:disable-next-line:forin
      for (const key in customParam) {
        search.set(key, customParam[key]);
      }
    }

    this.serverError = false;

    return new RequestOptions({ headers, withCredentials: true, search });
  }

  /***
   * http get helper
   * @param url
   * @param query
   * @param requiredAuth
   * @param headers
   * @returns {Observable<Response>}
   */
  get(
    url: string,
    query: Object,
    requiredAuth = false,
    headers?: Headers
  ): Observable<any> {
    return this.http
      .get(url, this.generateReqOptions(false, requiredAuth, headers, query))
      .map((response: Response) => {
        return this.checkAuthHeader(response);
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  /***
   * http post helper
   * @param url
   * @param body
   * @param isUrlEncoded
   * @param requiredAuth
   * @param headers
   * @returns {Observable<R|T>}
   */
  post(
    url: string,
    body: any,
    isUrlEncoded = false,
    requiredAuth = false,
    headers?: Headers
  ): Observable<any> {
    if (isUrlEncoded) {
      const urlSearchParams = new URLSearchParams();
      Object.keys(body).forEach(key => {
        urlSearchParams.append(key, body[key]);
      });
      body = urlSearchParams.toString();
    }

    let requestOptions = this.generateReqOptions(isUrlEncoded, requiredAuth, headers);
    if (body instanceof FormData) {
      requestOptions = this.generateReqOptions(isUrlEncoded, requiredAuth, headers, null, true);
    }
    return this.http
      .post(url, body, requestOptions)
      .map((response: Response) => {
        return this.checkAuthHeader(response);
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  /***
   * http patch helper
   * @param url
   * @param body
   * @param isUrlEncoded
   * @param requiredAuth
   * @param headers
   * @returns {Observable<R|T>}
   */
  patch(
    url: string,
    body: any,
    isUrlEncoded = false,
    requiredAuth = false,
    headers?: Headers
  ): Observable<any> {
    if (isUrlEncoded) {
      const urlSearchParams = new URLSearchParams();
      Object.keys(body).forEach(key => {
        urlSearchParams.append(key, body[key]);
      });
      body = urlSearchParams.toString();
    }
    return this.http
      .patch(url, body, this.generateReqOptions(isUrlEncoded, requiredAuth, headers))
      .map((response: Response) => {
        return this.checkAuthHeader(response);
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  /***
   * http put helper
   * @param url
   * @param body
   * @param isUrlEncoded
   * @param requiredAuth
   * @param headers
   * @returns {Observable<R|T>}
   */
  put(
    url: string,
    body: any,
    isUrlEncoded = false,
    requiredAuth = false,
    headers?: Headers
  ): Observable<any> {
    if (isUrlEncoded) {
      const urlSearchParams = new URLSearchParams();
      Object.keys(body).forEach(key => {
        urlSearchParams.append(key, body[key]);
      });
      body = urlSearchParams.toString();
    }
    return this.http
      .put(url, body, this.generateReqOptions(isUrlEncoded, requiredAuth, headers))
      .map((response: Response) => {
        return this.checkAuthHeader(response);
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  /***
   * http delete helper
   * @param url
   * @param query
   * @param requiredAuth
   * @param headers
   * @returns {Observable<Response>}
   */
  delete(
    url: string,
    query: Object,
    requiredAuth = false,
    headers?: Headers
  ): Observable<any> {
    return this.http
      .delete(url, this.generateReqOptions(false, requiredAuth, headers, query))
      .map((response: Response) => {
        return this.checkAuthHeader(response);
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  /***
   * http exception handler
   * @param error
   * @returns {any}
   */
  private handleError(error: Response | any) {
    let skipThrowingError = false;
    if (error.status === 500) {
      const body = error.json() || '';
      if (body.exception && body.exception === ErrorResponse.TOKEN_EXPIRE) {
        if (this.router.url.startsWith('/client')) {
          this.router.navigate(['/client/login']);
        } else {
          this.router.navigate(['login']);
        }
      } else {
        this.serverError = true;
        skipThrowingError = true;
      }
    } else if (error.status === 504) {
      this.serverError = true;
      skipThrowingError = true;
    }

    // go ahead to throw error for upload photo
    // const url = error.url;
    // if (url.endsWith('talent/upload-photo')) {
    //   skipThrowingError = false;
    // }

    if (skipThrowingError) {
      return Observable.never();
    }

    return Observable.throw(error);
  }
}
