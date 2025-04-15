import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookletsService {

      private apiUrl =environment.apiUrl;
  
  constructor(private http:HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-Type':'application/json',
      Authorization:`Bearer ${token}`,
    });
  }

  getBooklets():Observable<any>
  {
    return this.http.get(`${this.apiUrl}/getBooklets`,{headers:this.getAuthHeaders()})
  }

  getBooklet(bookletid:number):Observable<any>
  {
    return this.http.get(`${this.apiUrl}/getBooklet/${bookletid}`,{headers:this.getAuthHeaders()}).pipe(
      catchError((error:HttpErrorResponse)=>{
        let errorMessage = 'An error occurred while fetching booklet.';
        if(error.status === 404)
        {
          errorMessage='booklet not Found'
        }
        console.error('Error fetching booklet',error)
        return throwError(()=>new Error('Failed to retrieve booklet'));
      })
    );
  }

}
