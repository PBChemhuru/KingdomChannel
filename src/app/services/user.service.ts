import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7209';
  constructor(private http: HttpClient,private authService:AuthService) { }
  
  
  registerUser(regusername:string,regemail:string,regpassword:string): Observable<any>
  {
    const registerPayload ={ username:regusername,email:regemail.trim(),password:regpassword,role:'user'};
    console.log("Email being sent:", `"${registerPayload.email}"`);
    return this.http.post(`${this.apiUrl}/createUser`,registerPayload,{
      headers:new HttpHeaders({
        'Content-Type':'application/json',
      }),
    }).pipe
    (
      catchError((error)=>{console.error('Register Error',error);
        return throwError(()=> new Error('Registeration Failed'));
      }),
      tap((response)=>{console.log(response);
        this.authService.login(regusername,regpassword)
      })
    )
  }


}
