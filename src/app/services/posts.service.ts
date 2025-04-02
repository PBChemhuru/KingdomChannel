  import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { catchError, Observable, tap, throwError } from 'rxjs';
  import { environment } from '../../environment/environment';

  @Injectable({
    providedIn: 'root'
  })
  export class PostsService {
    private apiUrl =environment.apiUrl;

  constructor(private http:HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-Type':'application/json',
      Authorization:`Bearer ${token}`,
    });
  }

  getPosts():Observable<any> {
    return this.http.get(`${this.apiUrl}/getPosts`,{headers:this.getAuthHeaders(),})
  }

  getPost(postId:number):Observable<any>
  {
    return this.http.get(`${this.apiUrl}/getPost/${postId}`,{headers:this.getAuthHeaders(),}).pipe(
      catchError((error:HttpErrorResponse)=>{
        let errorMessage = 'An error occurred while fetching post.';
        if(error.status === 404)
        {
          errorMessage='Post not Found'
        }
        console.error('Error fetching post',error)
        return throwError(()=>new Error('Failed to retrieve post'));
      })
    );
  }
  }
