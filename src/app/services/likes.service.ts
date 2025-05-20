import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Like } from '../model/Like';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getLikes(id: number, contentType: string): Observable<any> {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('contenttype', contentType);

    return this.http
      .get(`${this.apiUrl}/getLikes`, {
       withCredentials: true, 
        params,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while updating booklet.';
          if (error.status === 404) {
            errorMessage = 'Booklet not Found';
          }
          console.error('Error updating booklet', error);
          return throwError(() => new Error('Failed to retrieve updating'));
        })
      );
  }

  like(id: number, contentType: string): Observable<any> {
    const payload =
    {
      ContentId:id,
      contentType:contentType,
    }
    return this.http
      .post(`${this.apiUrl}/like`,payload, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while liking .';
          if (error.status === 404) {
            errorMessage = 'content not Found';
          }
          console.error('Error liking article', error);
          return throwError(() => new Error('Failed to retrieve updating'));
        })
      );
  }

  userlikes(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/getuserlikes`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while updating booklet.';
          if (error.status === 404) {
            errorMessage = 'Booklet not Found';
          }
          console.error('Error updating booklet', error);
          return throwError(() => new Error('Failed to retrieve updating'));
        })
      );
  }
}
