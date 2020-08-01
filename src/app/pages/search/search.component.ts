import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
//import { User } from 'src/app/models/user.model';
//import { Doctor } from 'src/app/models/doctor.model';
//import { Hospital } from 'src/app/models/hospital.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: []
})
export class SearchComponent implements OnInit {
  public URL: string;
  //public users: User;
  //public doctors: Doctor;
  //public hospitals: Hospital;
  public totalH: number;
  public totalD: number;
  public totalU: number;

  constructor(
    // tslint:disable-next-line: variable-name
    public _activateRoute: ActivatedRoute,
    // tslint:disable-next-line: variable-name
    public _http: HttpClient
  ) {
    //this.users = new User('', '', '');
   // this.hospitals = new Hospital('', '', '');
    //this.doctors = new Doctor('', '', '', '');

    this.URL = URL_SERVICES;

    this._activateRoute.params.subscribe( params => {
      // tslint:disable-next-line: prefer-const
      let termino = params.termino;
      this.search(termino);
    });
  }

  ngOnInit() {
  }

  search(termino: string) {

    // if (termino.length <= 0) {
    //   Swal.fire('Mensaje', 'Debe indicar un termino de busqueda', 'warning');
    //   return;
    // }

    // // console.log(termino);
    // this._http.get(this.URL + '/search/all/' + termino).subscribe(
    //   (response: any) => {
    //     // console.log(response);
    //     this.users = response.users;
    //     this.hospitals = response.hospitals;
    //     this.doctors = response.doctors;
    //     this.totalH = response.hospitals.length;
    //     this.totalD = response.doctors.length;
    //     this.totalU = response.users.length;
    //      //console.log(this.users);
    //      //console.log(this.hospitals);
    //      //console.log(this.doctors);
    //   }
    // );
  }
}
