import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const router = inject(Router);

  return next(req).pipe(
    catchError(
      (error: HttpErrorResponse) => {
        console.log(error.status)
        if (error.status === 401) {

          console.error('authorization error:', error.error);
          router.navigate(['/auth']);
          return throwError(() => new Error('Log in to receive the data'));
        } else {

          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
          return throwError(() => new Error('Something bad happened; please try again later.'));
        }
      }
    )
  )
}

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {

  console.log('url', req.url);
  if (req.url.includes('/auth') || req.url.includes('/register')) return next(req);

  // Inject the current `AuthService` and use it to get an authentication token:
  // const authToken = inject(AuthService).getAuthToken();
  const authToken = '1234567';

  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('X-Authentication-Token', authToken),
  });
  return next(newReq);
}
