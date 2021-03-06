import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorTitle = 'Error occurred!';
        let errorMesage = 'An unkown error occurred!';
        if (error.error.title) {
          errorTitle = error.error.title;
        }
        if (error.error.message) {
          errorMesage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {
          data: { title: errorTitle, message: errorMesage },
        });
        return throwError(error);
      })
    );
  }
}
