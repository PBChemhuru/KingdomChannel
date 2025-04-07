import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, tap, Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl =environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const loginpayload = {
      username: username,
      password: password,
    };

    return this.http
      .post(`${this.apiUrl}/Login`, loginpayload, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        catchError((error) => {
          console.error('Login Error:', error);
          return throwError(() => new Error('Login Failed'));
        }),
        tap((response) => {
          console.log(response);
        })
      );
  }

  logout(): Observable<any> {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    const logoutPayload = { token: token };
    return this.http
      .post(`${this.apiUrl}\Logout`, logoutPayload, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        catchError((error) => {
          console.error('Logout Error', error);
          return throwError(() => new Error('Logout Failed'));
        }),
        tap((response) => {
          console.log('Logout Successful:', response);
          sessionStorage.removeItem('jwtToken');
        })
      );
  }

  getUserInfoFromToken(token:string):any {
    try
    {
      const payloadBase64 =token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      return JSON.parse(decodedPayload);
    }
    catch (error)
    {
      console.error('Error decoding the token', error);
      return throwError(() => new Error('Token Error'));
    }
  }
}
