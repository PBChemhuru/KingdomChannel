import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, tap, Observable, switchMap } from 'rxjs';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient,private router:Router) {}

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
        withCredentials:true,
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

  getUserInfoFromToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding the token', error);
      return throwError(() => new Error('Token Error'));
    }
  }
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('jwtToken');
  }

  getUsername(): string | null {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) return null;
    try {
      const user = this.getUserInfoFromToken(token);
      return user?.unique_name || null;
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) return null;
    try {
      const user = this.getUserInfoFromToken(token);
      return user?.role || null;
    } catch {
      return null;
    }
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/refresh`,
      {},
      { withCredentials: true }
    );
  }
  
  logout(): void {
  this.http.post(`${this.apiUrl}/Logout`, {}, { withCredentials: true }).subscribe({
    next: () => {
      sessionStorage.removeItem('jwtToken');
      this.router.navigate(['/']);
    },
    error: () => {
      sessionStorage.removeItem('jwtToken');
      this.router.navigate(['/']);
    }
  });
}
}
