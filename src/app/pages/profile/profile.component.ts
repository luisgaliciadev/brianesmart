import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  public user: User;
  public imageUpload: File;
  public tempImage: string;
  public google: boolean;
  public passReset = '';
  public passReset2 = '';
  public ID_USER = 0;
  public passActual = '';
  
  constructor(
    // tslint:disable-next-line: variable-name
    public _userService: UserService,
    public _router: Router
  ) {
    this.user = this._userService.user;
    this.google = this.user.GOOGLE;
    this.ID_USER = this._userService.user.ID_USER;
   }

  ngOnInit() {
    // console.log(this.ID_USER);
  }


  async saveProfile(user: User) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    //console.log(user);
    //return;
    this.user.NAME = user.NAME;
    this.user.PHONE = user.PHONE;
    if (!this.user.GOOGLE) {
      this.user.EMAIL = user.EMAIL;
    }
    // console.log(this.user);
    // return;
    this._userService.updateProfile(this.user).subscribe(
      response => {
        // Swal.fire('Mensaje', 'Usuario Registrado Correctamente', 'success');
        // console.log(response);
      }
    );

    // console.log(user);
  }

  selectImage(file: File) {

    if (!file) {
      this.imageUpload = null;
      return;
    } else {

      if (file.type.indexOf('image') < 0) {
        this.imageUpload = null;
        Swal.fire('Mensaje', 'Disculpe, tipo de archvio no valido', 'warning');
        return;
      }

      this.imageUpload = file;
      console.log(this.imageUpload);

      // tslint:disable-next-line: prefer-const
      let reader = new FileReader();
      // tslint:disable-next-line: prefer-const
      let urlImageTemp = reader.readAsDataURL(file);
      // console.log(this.imageUpload);

      reader.onloadend = () => this.tempImage = reader.result as string;
    }
  }

  async changeImage() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    this._userService.changeImage(this.imageUpload, this.user.ID_USER);
  }

  async updatePassword(user) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }

    if (user.passReset === user.passReset2) {
      
      if (user.passReset.length < 6) {
        Swal.fire('Mensaje', 'La constraseña debe tener al menos 6 caracteres.', 'warning');
      } else {
        this.user.PASSWORD = user.passActual;
        this.user.PASSWORD_NEW = user.passReset;
        this.user.ID_USER = this.ID_USER;
        // console.log(this.user);
        // return;
        this._userService.updatePassword(this.user).subscribe(
          (response: any) => {
            this.passActual = '';
            this.passReset = '';
            this.passReset2 = '';
            this._router.navigate(['/profile']);
          }
        );
      }      
    } else {
      Swal.fire('Mensaje', 'Las constraseñas no son iguales.', 'warning');
    }

  }

 


}
