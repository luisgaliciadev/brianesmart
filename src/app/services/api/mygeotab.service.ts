import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';

import Swal from 'sweetalert2';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class MygeotabService {

  public URL = URL_SERVICES;

  constructor(
   
    public _userService: UserService,
    public _http: HttpClient,
    public _router: Router,
  ) { }

// Get Divices
getDivices() {
  return this._http.get(this.URL + '/mygeotab/divices')
  .pipe(map((res: any) => {
    return res;
  }));
}
// End Get Divices

// Get totalhoursengine
getTotalHoursEngine() {
  return this._http.get(this.URL + '/mygeotab/totalhoursengine')
  .pipe(map((res: any) => {
    return res;
  }));
}
// End Get totalhoursengine

// Get hoursEngine
getHoursEngine(desde, hasta) {
  return this._http.get(this.URL + '/mygeotab/hoursengine/' + desde + '/' + hasta)
  .pipe(map((res: any) => {
    return res;
  }));
}
// End Get hoursEngine

// Get odometer
getOdometer(desde, hasta) {
  return this._http.get(this.URL + '/mygeotab/odometer/' + desde + '/' + hasta)
  .pipe(map((res: any) => {
    return res;
  }));
}
// End Get odometer

// Get fuelconsume
getFuelConsume(desde, hasta) {
  return this._http.get(this.URL + '/mygeotab/fuelconsume/' + desde + '/' + hasta)
  .pipe(map((res: any) => {
    return res;
  }));
}
// End Get fuelconsume

}
