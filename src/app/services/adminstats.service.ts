import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AdminStatsDto } from '../model/AdminStats';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminstatsService {
  private apiUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }
  
  getadminstats():Observable<any>
  {
    return this.http.get(`${this.apiUrl}/admin/stats`).pipe(
    catchError((error:HttpErrorResponse)=>
    {
      let errorMessage = 'An error occurred while fetching booklet.';
                if (error.status === 404) {
                  errorMessage = 'booklet not Found';
                }
                console.error('Error fetching booklet', error);
                return throwError(() => new Error('Failed to retrieve booklet'));
    })
    )
  }
}
