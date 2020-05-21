import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { UploadFileService } from '../../services/uploadFile/upload-file.service';
import { ModalUploadService } from './modal-upload.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {


  //public user: User;
  public imageUpload: File;
  public tempImage: string;
  public google: boolean;
  public file: string;

  constructor(
    // tslint:disable-next-line: variable-name
    public _uploadFile: UploadFileService,
    // tslint:disable-next-line: variable-name
    public _modalUploadService: ModalUploadService,
    // tslint:disable-next-line: variable-name
    public _userService: UserService
  ) {
    // console.log('modal listo');
    this.file = '';
  }

  ngOnInit() {
  }

  // Seleccionar imagen
  selectImage(file: File) {

    if (!file) {
      this.imageUpload = null;
      return;
    } else {

      if (file.type.indexOf('image') < 0) {
        this.imageUpload = null;
        // Swal.fire('Mensaje', 'Disculpe, tipo de archvio no valido', 'warning');
        return;
      }

      this.imageUpload = file;

      // tslint:disable-next-line: prefer-const
      let reader = new FileReader();
      // tslint:disable-next-line: prefer-const
      let urlImageTemp = reader.readAsDataURL(file);
      // console.log(this.imageUpload);

      reader.onloadend = () => this.tempImage = reader.result as string;
    }
  }

  uploadImage() {
    // tslint:disable-next-line: max-line-length
    this._uploadFile.uploadFile(this.imageUpload, this._modalUploadService.type, this._modalUploadService.id, this._userService.user.ID_USER)
      .then( (resp: any) => {
        // console.log(resp);
          // this._userService.user.IMAGE = this.imageUpload;
         // this.saveLocalStorage(id, this.token, this.user, this.menu);
        Swal.fire('Mensaje', 'Imagen Guardada Correctamente', 'success');
        this._modalUploadService.notificacion.emit(resp);
        // console.log(resp);
        this.closeModal();
      })
      .catch( err => {
        Swal.fire('Mensaje', 'Error al Subir la Imagen', 'warning');
        // console.log('Error Al subir la Imagen.');
      });
  }

  closeModal() {
    this.imageUpload = null;
    this.tempImage = null;
    this.file = '';

    this._modalUploadService.hideModal();
  }

}
