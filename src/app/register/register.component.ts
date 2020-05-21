// Modules
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Others
// import swal from 'sweetalert';
import Swal from 'sweetalert2';

// Services
import { UserService } from '../services/service.index';
import { User } from '../models/user.model';


declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public user: User;

  forma: FormGroup;

  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    // tslint:disable-next-line: variable-name
    public _router: Router
  ) { }

  validarPassword(a: string, b: string) {
    return (group: FormGroup) => {

      const pass1 = group.controls[a].value;
      const pass2 = group.controls[b].value;

      if (pass1 === pass2) {
        return null;
      } else {
        return {
          isOk: true
        };
      }
    };
  }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, {validators: this.validarPassword('password', 'password2')});
  }

  onSubmit() {
    if (!this.forma.valid) {
      return;
    }

    if (!this.forma.value.condiciones) {

      Swal.fire('Importante', 'Debe aceptar los Terminos.', 'warning');
      return;

    }
    this.user = new User(
      this.forma.value.name,
      this.forma.value.email,
      this.forma.value.password
    );
    
    // console.log(this.forma.value.password.length);
    // return;
    if (this.forma.value.password.length < 6) {
      Swal.fire('Mensaje', 'La constraseña debe tener al menos 6 caracteres.', 'warning');
    } else {
      this._userService.userRegister(this.user).subscribe(
        response => {  
          this._router.navigate(['/login']);  
        }
      );
      // console.log(this.user);
    }    
  }
}
