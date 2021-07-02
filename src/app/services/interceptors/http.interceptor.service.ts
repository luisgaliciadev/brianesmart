import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserService } from '../user/user.service';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    public _UserService: UserService,
    private toastr: ToastrService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers: HttpHeaders;
    let token = this._UserService.token;
    if (!token) {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    }
    const reqClone = req.clone({ headers });
    // console.log(reqClone.headers);
    return next.handle(reqClone).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err.status)
        if (err.status === 400) {
          this.toastr.error(err.error.message, 'Error');
          return throwError(err);
        } else {
          this.toastr.error('Error en la petición.', 'Error de Conexión');
          return throwError(err);
        }
      })
    );
  }

}