import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from "moment";

@Injectable()
export class UserService {

  // http options used for making API calls
  private httpOptions: any;

  // the actual JWT access token
  public access: string;

  // the actual JWT refresh token
  public refresh: string;

  // the access token expiration date
  public token_expires: Date;

  // the refresh token expiration date
  public refresh_token_expires: Date;

  // the user ID of the logged in user
  public user_id: string;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public rememberMe() {
    const refreshToken = localStorage.getItem("refresh");
    this.refresh = refreshToken;
    this.refreshToken();
  }



  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public registerUser(data) {
    this.http.post('http://127.0.0.1:8000/api/users/', JSON.stringify(data), this.httpOptions).subscribe(
      data => {
        console.log('register success', data);
      },
      err => {
        console.error('register error', err);
        this.errors = err['error'];
      }
    );
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user) {
    this.http.post('http://127.0.0.1:8000/api/token/', JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        console.log('login success', data);
        this.updateData(data['access']);
        this.saveRefresh(data['refresh']);
      },
      err => {
        console.error('login error', err);
        this.errors = err['error'];
      }
    );
  }

  /**
   * Refreshes the JWT token, to extend the time the user is logged in
   */
  public refreshToken() {
    this.http.post('http://127.0.0.1:8000/api/token/refresh/', JSON.stringify({refresh: this.refresh}), this.httpOptions).subscribe(
      data => {
        console.log('refresh success', data);
        this.updateData(data['access']);
      },
      err => {
        console.error('refresh error', err);
        this.errors = err['error'];
      }
    );
  }

  public logout() {
    this.access = null;
    this.refresh = null;
    this.token_expires = null;
    this.user_id = null;
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("expires_at");
  }

  private updateData(access) {
    this.access = access;
    this.errors = [];

    // decode the token to read the username and expiration timestamp
    const token_parts = this.access.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);

    if(token_decoded.exp*1000 > Date.now()){
      console.log("Access Token Geçerli.", this.token_expires )
    } else {
      console.log("Access Token süresi dolmuş panpa", token_decoded.exp );
    }

    this.user_id = token_decoded.user_id;
    const expiresAt = this.token_expires;

    localStorage.setItem('access', access);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }

  public saveRefresh(refresh)
  {
    this.refresh = refresh;

    const token_parts = this.refresh.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.refresh_token_expires = new Date(token_decoded.exp * 1000);

    if(token_decoded.exp*1000 > Date.now()){
      console.log("Refresh Token Geçerli.", this.refresh_token_expires )
    } else {
      console.log("Refresh Token süresi dolmuş panpa", token_decoded.exp );
    }

    const expiresAtR = this.token_expires;

    localStorage.setItem('refresh', refresh);
    localStorage.setItem("refresh_expires_at", JSON.stringify(expiresAtR.valueOf()) );
  }


public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
}

isLoggedOut() {
    return !this.isLoggedIn();
}

getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
}

getExpirationR() {
    const expirationR = localStorage.getItem("refresh_expires_at");
    const expiresAtR = JSON.parse(expirationR);
    return moment(expiresAtR);
}

}
