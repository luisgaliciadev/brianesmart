import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { URL_SERVICES } from '../../config/config';

@Component({
  selector: 'app-repositorio-docs',
  templateUrl: './repositorio-docs.component.html',
  styles: [
  ]
})
export class RepositorioDocsComponent implements OnInit {
  pdfSrc = '';
  URL = URL_SERVICES;

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService
  ) { }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url); 
    
    console.log(this.pdfSrc);
  }

  verPdf() {
    this.pdfSrc = this.URL +'/image/pdf/prueba.pdf';  
  }



}
