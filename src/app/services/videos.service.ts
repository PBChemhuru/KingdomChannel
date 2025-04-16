import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
 private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
      const token = sessionStorage.getItem('jwtToken');
      return new HttpHeaders({
        'Content-Type':'application/json',
        Authorization:`Bearer ${token}`,
      });
    }
  
    getVideos():Observable<any>
    {
      return this.http.get(`${this.apiUrl}/getVideos`,{headers:this.getAuthHeaders()})
    }
  
    getVideo(videoid:number):Observable<any>
    {
      return this.http.get(`${this.apiUrl}/getBooklet/${videoid}`,{headers:this.getAuthHeaders()}).pipe(
        catchError((error:HttpErrorResponse)=>{
          let errorMessage = 'An error occurred while fetching video link.';
          if(error.status === 404)
          {
            errorMessage='Video not Found'
          }
          console.error('Error fetching video',error)
          return throwError(()=>new Error('Failed to retrieve video'));
        })
      );
    }
}
