import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AdminStatsDto } from '../model/AdminStats';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminstatsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getadminstats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while fetching stats.';
        if (error.status === 404) {
          errorMessage = 'stats not Found';
        }
        console.error('Error fetching stats', error);
        return throwError(() => new Error('Failed to retrieve stats'));
      })
    );
  }

  getHomeStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/homestats`).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while fetching stats.';
        if (err.status === 404) {
          errorMessage = 'stats not Found';
        }
        console.error('Error fetching stats', err);
        return throwError(() => new Error('Failed to retrieve stats'));
      })
    );
  }

  selectFeature(ContentType: string, ContentId: number): Observable<any> {
    const payload = {
      ContentType: ContentType,
      ContentId: ContentId,
    };
    console.log(payload)
    return this.http.post(`${this.apiUrl}/selectFeature`, payload,{
       withCredentials: true,
      }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while fetching stats.';
        if (error.status === 404) {
          errorMessage = 'stats not Found';
        }
        console.error('Error fetching stats', error);
        return throwError(() => new Error('Failed to retrieve stats'));
      })
    );
  }

  getFeature():Observable<any>
  {
    return this.http.get(`${this.apiUrl}/getFeature`,{withCredentials:true}).pipe(
      catchError((error:HttpErrorResponse)=>
      {
         let errorMessage = 'An error occurred while fetching stats.';
        if (error.status === 404) {
          errorMessage = 'stats not Found';
        }
        console.error('Error fetching stats', error);
        return throwError(() => new Error('Failed to retrieve stats'));
      })
    )
  }
}
