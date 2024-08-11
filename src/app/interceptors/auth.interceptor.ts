import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt/jwt.service';
import { LoaderService } from '../services/loader/loader.service';
import { catchError, finalize, map, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next
) => {
  const token = inject(JwtService).getToken();
  const loaderService = inject(LoaderService);
  let modifiedReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  loaderService.startLoader();
  return next(modifiedReq);
};
