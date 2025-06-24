import { Injectable,Input } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterServiceService {
private apiUrl =environment.apiUrl;
  constructor(private http:HttpClient) {
   }
   subscribetoNewletter(email: string): Observable<any> {
    const emailpayload={
      email:email
    }
    return this.http.post(`${this.apiUrl}/subscribe`,  emailpayload).pipe( catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while adding post.';
          console.error('Error adding post', error);
          return throwError(() => new Error('Failed to adding'));
        })

    );
  }
}
