import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostCommentsService {
  private apiUrl =environment.apiUrl;
  constructor(private http:HttpClient) { }

  private getAuthHeaders():HttpHeaders {
    const token = sessionStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-type':'application/json',
      Authorization:`Bearer ${token}`
    });
  }

  getPostComments(postId:number):Observable<any>
  {
    return this.http.get(`${this.apiUrl}/getPostComments/${postId}`,{headers:this.getAuthHeaders()})
  }
}
