import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Postcomments } from '../model/Postcoments';


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

  createPostComment(comment:string,postId:number,userId:number):Observable<any>
  {
    const payload =
    {
      postComment:comment.trim(),
      postId:postId,
      userId:userId
    }
    return this.http.post(`${this.apiUrl}/createPostComment`,payload,{headers:this.getAuthHeaders()}).pipe(
      catchError((error:HttpErrorResponse)=>{
        let errorMessage = 'An error occured while posting comment,';
        if(error.status == 401)
        {
          errorMessage = 'Unauthorized Request';
        }
        console.error('Error posting comment',error)
        return throwError(()=> new Error('Commment not posted'))
      })
    )
  }
  

  updatePostComment(postCommentId:number,postComment:string)
  {
    const payload =
    {
      postId:postCommentId,
      postComment:postComment,
    }

    return this.http.post(`${this.apiUrl}/editPostComment/${postCommentId}`,payload,{headers:this.getAuthHeaders()}).pipe
    (
      catchError((error:HttpErrorResponse)=>
      {
        let errorMessage = 'An Error occured while saving your changes';
        if(error.status == 401)
          {
            errorMessage = 'Unauthorized Request';
          }
          console.error('Error updating comment',error)
          return throwError(()=> new Error('Commment not updated'))
      })
    )
  }

  deletePostComment(postCommentId:number)
  {
    return this.http.delete(`${this.apiUrl}/deletePostComment/${postCommentId}`).pipe(
      catchError((error:HttpErrorResponse)=>{
        let errorMessage = 'An error occured while deleting comment,';
        if(error.status == 401)
        {
          errorMessage = 'Unauthorized Request';
        }
        console.error('Error deleting comment',error)
        return throwError(()=> new Error('Commment not delete'))
      })
    )
  }
}
