import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Video } from '../model/Video';


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
      return this.http.get(`${this.apiUrl}/getVideo/${videoid}`,{headers:this.getAuthHeaders()}).pipe(
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

    updateVideo(video:Video):Observable<any>
      {
        return this.http.put(`${this.apiUrl}/updateVideo/${video.videoId}`,video,{withCredentials: true, }).pipe(
          catchError((error:HttpErrorResponse)=>{
            let errorMessage = 'An error occurred while updating video.';
            if(error.status === 404)
            {
              errorMessage='Video not Found'
            }
            console.error('Error updating video',error)
            return throwError(()=>new Error('Failed to retrieve updating'));
          })
        )
      }
    
      deleteVideo(videoId:number):Observable<any>
      {
        return this.http.delete(`${this.apiUrl}/deleteVideo/${videoId}`,{headers:this.getAuthHeaders()}).pipe(
          catchError((error:HttpErrorResponse)=>{
            let errorMessage = 'An error occurred while deleting video.';
            if(error.status === 404)
            {
              errorMessage='Video not Found'
            }
            console.error('Error deleting video',error)
            return throwError(()=>new Error('Failed to retrieve deleting'));
          })
        )
      }

      createVideo(formData : FormData):Observable<any>
  {
   return this.http
      .post(`${this.apiUrl}/createVideo`,formData, {
       withCredentials: true,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred while adding video.';
          console.error('Error adding video', error);
          return throwError(() => new Error('Failed to adding video'));
        })
      );
  } 
}
