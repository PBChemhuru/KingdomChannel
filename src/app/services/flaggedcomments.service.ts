import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import { FlaggedComment } from '../model/FlaggedComment';

@Injectable({
  providedIn: 'root',
})
export class FlaggedcommentsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getFlaggedComments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getFlaggedComments`, {
     withCredentials: true, 
    });
  }
  flagComment(commentId: number, flagDescription: string): Observable<any> {
    const payload = {
      commentId: commentId,
      flagDescription: flagDescription,
      flagResolutionStatus: 'false',
    };
    return this.http
      .post(`${this.apiUrl}/flagComment`, payload, {
       withCredentials: true, 
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while flagging comment.';
          if (error.status === 404) {
            errorMessage = 'Comment not Found';
          }
          console.error(error);
          return throwError(() => new Error('Failed to flag comment'));
        })
      );
  }
  updateflag(flag:FlaggedComment): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/resolvepostCommentFlag/${flag.flagId}`,flag, {
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

  
}
