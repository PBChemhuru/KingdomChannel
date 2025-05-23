import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environment/environment';
import { User } from '../model/User';
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

  getuser(userId:number):Observable<any>
  {
    return this.http.get(`${this.apiUrl}/userprofile/${userId}`,{withCredentials:true}).pipe(
      catchError((error:HttpErrorResponse)=>{
        let errorMessage = 'An error occurred while registering user.';
        if(error.status === 400)
        {
          errorMessage = 'Bad request'
        }
        console.error('Error Registering User',error)
        return throwError(()=> new Error('Registeration Failed'));
      })
    )
  }

  getUsers():Observable<any>
  {
    return this.http.get(`${this.apiUrl}/getUsers`,{withCredentials:true}).pipe(
      catchError((error:HttpErrorResponse)=>
      {
        let errorMessage = 'An errror occured while fetching users'
        if(error.status === 400)
        {
          errorMessage='Bad request'
        }
        console.error(error)
        return throwError(()=>new Error('Failed to get Users'))
      })
    )
  }

  deleteUser(userId:number):Observable<any>
  {
    return this.http.delete(`${this.apiUrl}/deleteUser/${userId}`,{withCredentials:true}).pipe(
      catchError((error:HttpErrorResponse)=>
      {
        let errorMessage = 'An errror occured while deleting user'
        if(error.status === 400)
        {
          errorMessage='Bad request'
        }
        console.error(error)
        return throwError(()=>new Error('Failed to delete User'))
      })
    )
  }

  updateUser(userId:Number,formdata:FormData):Observable<any>
  {
    return this.http.put(`${this.apiUrl}/updateUserProfile/${userId}`,formdata,{withCredentials:true}).pipe
    (
      catchError((error:HttpErrorResponse)=>
      {
        let errorMessage = 'An errror occured while updating user'
        if(error.status === 400)
        {
          errorMessage='Bad request'
        }
        console.error(error)
        return throwError(()=>new Error('Failed to update User'))
      })
    )
  }

  createUser(formdata:FormData):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/createUser`,formdata,{withCredentials:true}).pipe
    (
      catchError((error:HttpErrorResponse)=>
      {
        let errorMessage = 'An errror occured while updating user'
        if(error.status === 400)
        {
          errorMessage='Bad request'
        }
        console.error(error)
        return throwError(()=>new Error('Failed to update User'))
      })
    )
  }
}
