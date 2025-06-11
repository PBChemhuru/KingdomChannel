import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {
   private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  getBookmarks(id: number, contentType: string): Observable<any> {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('contenttype', contentType);

    return this.http
      .get(`${this.apiUrl}/getBookmarks`, {
        withCredentials: true,
        params,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while fetching bookmark.';
          if (error.status === 404) {
            errorMessage = 'Bookmarks not Found';
          }
          console.error('Error fetching Bookmarks', error);
          return throwError(() => new Error('Failed to retrieve Bokomarks'));
        })
      );
  }

  bookmark(id: number, contentType: string): Observable<any> {
    const payload = {
      ContentId: id,
      contentType: contentType,
    };
    return this.http
      .post(`${this.apiUrl}/bookmark`, payload, { withCredentials:true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while saving .';
          if (error.status === 404) {
            errorMessage = 'content not Found';
          }
          if (error.status === 401) {
            errorMessage = 'You need to log in to save this content.';
          }
          console.error('Error saving article', error);
          return throwError(() => new Error('Failed to save articles'));
        })
      );
  }

  userbookmarks(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/getuserbookmarks`, { withCredentials:true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while fetching bookmark.';
          if (error.status === 404) {
            errorMessage = 'Booklet not Found';
          }
          console.error('An error occurred while fetching bookmark.', error);
          return throwError(() => new Error('An error occurred while fetching bookmark.'));
        })
      );
  }
}
