import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { DecodedToken } from '../model/DecodedToken';
import { ContentType } from '../model/ContentType.enum';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = `${environment.apiUrl}`;
  userinfo!: DecodedToken;
  constructor(private http: HttpClient, private authservice: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getCommentsByContentType(
    contentType: ContentType,
    contentId: number
  ): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/${contentType}/${contentId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occured while posting comment,';
          if (error.status == 401) {
            errorMessage = 'Unauthorized Request';
          }
          console.error(errorMessage, error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  createComment(
    comment: string,
    postId?: number,
    videoId?: number,
    bookletId?: number
  ): Observable<any> {
    const payload = {
      comment: comment.trim(),
      postId: postId,
      videoId: videoId,
      bookletId: bookletId,
    };
    return this.http
      .post(`${this.apiUrl}/comments`, payload, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occured while posting comment,';
          if (error.status == 401) {
            errorMessage = 'Unauthorized Request';
          }
          console.error(errorMessage, error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  updatePostComment(commentId: number, comment: string) {
    const payload = {
      commentId: commentId,
      comment: comment,
    };

    return this.http
      .put(`${this.apiUrl}/${commentId}`, payload, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An Error occured while saving your changes';
          if (error.status == 401) {
            errorMessage = 'Unauthorized Request';
          }
          console.error('Error updating comment', error);
          return throwError(() => new Error('Commment not updated'));
        })
      );
  }

  deleteComment(commentId: number) {
    return this.http
      .delete(`${this.apiUrl}/${commentId}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occured while deleting comment,';
          if (error.status == 401) {
            errorMessage = 'Unauthorized Request';
          }
          console.error('Error deleting comment', error);
          return throwError(() => new Error('Commment not delete'));
        })
      );
  }

  flagComment(commentId: number, flagDescription: string): Observable<any> {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      this.userinfo = this.authservice.getUserInfoFromToken(token);
    } else {
      console.log('No token found');
    }
    const payload = {
      commentId: commentId,
      userId: this.userinfo.nameid,
      flagResolutionStatus: 'false',
      flagDescription: flagDescription,
    };

    return this.http
      .post(`${this.apiUrl}/flagComment`, payload, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occured while deleting comment,';
          if (error.status == 401) {
            errorMessage = 'Unauthorized Request';
          }
          console.error('Error flagging comment', error);
          return throwError(() => new Error('Commment not flag'));
        })
      );
  }
}
