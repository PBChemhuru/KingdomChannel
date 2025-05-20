import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next:HttpHandlerFn) => {
  const authservice = inject(AuthService);
  const token = sessionStorage.getItem('jwtToken');
  const authReq = token? req.clone({
    setHeaders: {
      Authorization :`Bearer ${token}`
    },
  }):req

  return next(authReq).pipe(
    catchError((error:HttpErrorResponse)=>{
      if(error.status === 401)
      {
        return authservice.refreshToken().pipe(
          switchMap((response: {accessToken: string}) =>{
            const newToken = response.accessToken;
            sessionStorage.setItem('jwtToken',newToken);

            const retryReq = req.clone({
              setHeaders:{Authorization:`Bearer ${newToken}`,},
            });
            return next(retryReq);
          }),
          catchError(err=>{
            authservice.logout();
            return throwError(()=>err);
          })
         
        );

      }
      return throwError(()=>error);
    })
  );
};
