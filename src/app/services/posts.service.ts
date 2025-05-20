  import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { catchError, Observable, tap, throwError } from 'rxjs';
  import { environment } from '../../environment/environment';
import { Post } from '../model/Post';

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
    return this.http.get(`${this.apiUrl}/getPosts`,{withCredentials: true, })
  }

  getPost(postId:number):Observable<any>
  {
    console.log(this.getAuthHeaders());

    return this.http.get(`${this.apiUrl}/getPost/${postId}`,{withCredentials: true, }).pipe(
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

  updatePost(post:Post):Observable<any>
  {
    return this.http.put(`${this.apiUrl}/updatePost/${post.postId}`,post,{withCredentials: true, }).pipe(
      catchError((error:HttpErrorResponse)=>{
        let errorMessage = 'An error occurred while updating post.';
        if(error.status === 404)
        {
          errorMessage='Post not Found'
        }
        console.error('Error updating post',error)
        return throwError(()=>new Error('Failed to retrieve updating'));
      })
    )
  }

  deletePost(postId:number):Observable<any>
  {
    return this.http.delete(`${this.apiUrl}/deletePost/${postId}`,{headers:this.getAuthHeaders()}).pipe(
      catchError((error:HttpErrorResponse)=>{
        let errorMessage = 'An error occurred while deleting post.';
        if(error.status === 404)
        {
          errorMessage='Post not Found'
        }
        console.error('Error deleting post',error)
        return throwError(()=>new Error('Failed to retrieve deleting'));
      })
    )
  }
  }
