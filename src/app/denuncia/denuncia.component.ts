import { Component, OnInit } from '@angular/core';
import { RegisterService, UserService } from '../services/service.index';
import Swal from 'sweetalert2';
import { Denuncia } from '../models/denuncia.model';


declare function init_plugins();

@Component({
  selector: 'app-denuncia',
  templateUrl: './denuncia.component.html',
  styles: [
  ]
})
export class DenunciaComponent implements OnInit {

  denuncia: Denuncia = new Denuncia('', '', false, false, '', '', '', '', '', '', '', '','');
  empleado = false;
  anonimato = false;
  idDenuncia: number;
  extesion = ['png','PNG','jpeg','JPEG','jpg','JPG','pdf','txt','zip','rar','docx','xlsx', 'pptx']; 
  imageUpload: File;
  tempImage: string;
  imageUpload2: File;
  tempImage2: string;
  imageUpload3: File;
  tempImage3: string;

  constructor(
    public _registerService: RegisterService,
    public _userService: UserService
  ) { }

  ngOnInit(): void {
    init_plugins();
  }

  guardarDenuncia(denuncia) {       
    this.denuncia = denuncia;
    this.denuncia.FG_EMPLEADO = this.empleado;
    this.denuncia.FG_ANONIMATO = this.anonimato;        
    this._registerService.registerDenuncia(this.denuncia).subscribe(
    (response: any) => {
      if (response) {
        this.denuncia = new Denuncia('', '', false, false, '', '', '', '', '', '', '', '', '');
        this.idDenuncia = response.denuncia.ID_DENUNCIA;
        if (this.idDenuncia > 0) {
          if (this.imageUpload) {
            this.changeImage(this.imageUpload, 1);
          }
          if (this.imageUpload2) {
            this.changeImage(this.imageUpload2, 2);
          }
          if (this.imageUpload3) {
              this.changeImage(this.imageUpload3, 3);
          }
          this.imageUpload = null;
          this.imageUpload2= null;
          this.imageUpload3 = null;
        }
      }
    });
  }

  selectImage(file: File) {
    // console.log(file);
    if (!file) {
      this.imageUpload = null;
      return;
    } else {

      var fileName = file.name.split('.');
      var extFile = fileName[fileName.length - 1];      
           
      if (this.extesion.indexOf(extFile) < 0) {
        this.imageUpload = null;
        Swal.fire('Mensaje', 'Disculpe, tipo de archvio no valido', 'warning');
        return;
      }

      if (file.size > 10000000) {
        this.imageUpload = null;
        Swal.fire('Mensaje', 'Disculpe, tamaño del archivo no debe superar los 10 MB', 'warning');
        return;
      }

      this.imageUpload = file;
      let reader = new FileReader();
      let urlImageTemp = reader.readAsDataURL(file);
      reader.onloadend = () => this.tempImage = reader.result as string;
    }
  }

  selectImage2(file: File) {
    if (!file) {
      this.imageUpload2 = null;
      return;
    } else {

      var fileName = file.name.split('.');
      var extFile = fileName[fileName.length - 1];           
           
      if (this.extesion.indexOf(extFile) < 0) {
        this.imageUpload2 = null;
        Swal.fire('Mensaje', 'Disculpe, tipo de archvio no valido', 'warning');
        return;
      }
      
      if (file.size > 10000000) {
        this.imageUpload = null;
        Swal.fire('Mensaje', 'Disculpe, tamaño del archivo no debe superar los 10 MB', 'warning');
        return;
      }

      this.imageUpload2 = file;
      let reader = new FileReader();
      let urlImageTemp = reader.readAsDataURL(file);
      reader.onloadend = () => this.tempImage2 = reader.result as string;
    }
  }

  selectImage3(file: File) {
    if (!file) {
      this.imageUpload3 = null;
      return;
    } else {

      var fileName = file.name.split('.');
      var extFile = fileName[fileName.length - 1];
       
      if (this.extesion.indexOf(extFile) < 0) {
        this.imageUpload3 = null;
        Swal.fire('Mensaje', 'Disculpe, tipo de archvio no valido', 'warning');
        return;
      }
      
      if (file.size > 10000000) {
        this.imageUpload = null;
        Swal.fire('Mensaje', 'Disculpe, tamaño del archivo no debe superar los 10 MB', 'warning');
        return;
      }

      this.imageUpload3 = file;
      let reader = new FileReader();
      let urlImageTemp = reader.readAsDataURL(file);
      reader.onloadend = () => this.tempImage3 = reader.result as string;
    }
  }

  changeImage(archivo, numArchivo: number) {
    this._registerService.uploadFileDenuncia(archivo, this.idDenuncia, numArchivo);
  }

  fnEmpleado(valor) {    
    this.empleado = valor;
    // console.log(this.empleado);
  }

  fnAnonimato(valor) {
    this.anonimato = valor;
    // console.log(this.anonimato);
  }

}
