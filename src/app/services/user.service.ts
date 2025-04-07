import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl =environment.apiUrl;
  
  constructor(private http: HttpClient,private authService:AuthService) { }
  
  
  registerUser(regusername:string,regemail:string,regpassword:string): Observable<any>
  {
    const registerPayload ={ username:regusername,email:regemail.trim(),password:regpassword,role:'user'};
    return this.http.post(`${this.apiUrl}/createUser`,registerPayload,{
      headers:new HttpHeaders({
        'Content-Type':'application/json',
      }),
    }).pipe
    (
      catchError((error:HttpErrorResponse)=>{
        let errorMessage = 'An error occurred while registering user.';
        if(error.status === 400)
        {
          errorMessage = 'Bad request'
        }
        console.error('Error Registering User',error)
        return throwError(()=> new Error('Registeration Failed'));
      }),
      tap((response)=>{console.log(response);
        this.authService.login(regusername,regpassword)
      })
    )
  }


}
