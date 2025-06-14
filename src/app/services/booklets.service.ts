import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Booklet } from '../model/Booklet';

@Injectable({
  providedIn: 'root',
})
export class BookletsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getBooklets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getBooklets`, {
     withCredentials: true, 
    });
  }

  getBooklet(bookletid: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/getBooklet/${bookletid}`, {
       withCredentials: true, 
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while fetching booklet.';
          if (error.status === 404) {
            errorMessage = 'booklet not Found';
          }
          console.error('Error fetching booklet', error);
          return throwError(() => new Error('Failed to retrieve booklet'));
        })
      );
  }

  updateBooklet(formData : FormData,bookletid: number): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/updateBooklet/${bookletid}`,formData , {
       withCredentials: true, 
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

  deleteBooklet(bookletId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/deleteBooklet/${bookletId}`, {
       withCredentials: true, 
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while deleting booklet.';
          if (error.status === 404) {
            errorMessage = 'Booklet not Found';
          }
          console.error('Error deleting booklet', error);
          return throwError(() => new Error('Failed to retrieve deleting'));
        })
      );
  }

  createBooklet(formData : FormData):Observable<any>
  {
   return this.http
      .post(`${this.apiUrl}/createBooklet`,formData, {
       withCredentials: true,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while adding booklet.';
          console.error('Error adding booklet', error);
          return throwError(() => new Error('Failed to adding'));
        })
      );
  } 
}
