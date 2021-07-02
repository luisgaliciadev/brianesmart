import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
// import {FileSaver} from 'file-saver';
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';

// const EXCEL_TYPE = 'application/vnd.openxmlformarts-officedocument.spreadsheetml.sheet; charset=UTF-8';
// const EXCEL_EXT = '.xlsx';

@Component({
  selector: 'app-productividad-conductor',
  templateUrl: './productividad-conductor.component.html',
  styles: [
  ]
})
export class ProductividadConductorComponent implements OnInit {
  
  productividadConductores = [];
  desde = 0;
  hasta = 5;
  totalRegistros = 0;
  search = '';
  activeButton;
  fhDesde;
  fhHasta;
  date = new Date();
  mes;
  dia;
  paginas = 0;
  pagina = 1;
  productividadTotal: any = [];
  dias = [];
  cantDias = 0;
  viajes = "viajes"
  anchoTabla = 0;
  zonasConductor = [];
  idZona = 0;

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService,
    private spinner: NgxSpinnerService
  ) { 
    this.mes = this.date.getMonth() + 1;
    this.dia = this.date.getDate();

    if (this.mes < 10) {
      this.mes = 0 + this.mes.toString(); 
    }

    if (this.dia < 10) {
      this.dia = 0 + this.dia.toString(); 
    }

    this.fhDesde = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
    this.fhHasta = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
  }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getZonasConcutor();
  }

  getZonasConcutor() {
    this.spinner.show();
    this._registerService.getZonaConductor().subscribe(
      (response: any) => {        
        this.zonasConductor = response.zonasConductor
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  async getProductividad() {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }
    let search = ''
    if(this.search === '') {
      search = '0';
    } else {
      search = this.search;
    }
    this.spinner.show();
    this._registerService.getProductividadConductor(this.fhDesde, this.fhHasta, this.idZona, search).subscribe(
      (response: any) => {
        this.desde = 0;
        this.hasta = 5;
        this.pagina = 1;
        this.totalRegistros = response.productividaConductor.length;
        this.dias = response.dias;
        this.cantDias = this.dias.length;
        this.anchoTabla = ( this.cantDias * 300) + 270;
        this.productividadTotal = response.productividaConductor;
        this.productividadConductores = this.productividadTotal.slice(this.desde, this.hasta);
        this.paginas = Math.ceil(this.totalRegistros / 5);
        if (this.paginas <= 1) {
          this.paginas = 1;
        }
        this.spinner.hide();
      }, 
      error => {
        this.spinner.hide();
      }
    );
  }

  async registerUpdateMotivoNoProdConductor(i, dia, fecha) {
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }

    if (this.productividadConductores[i][dia]['motivo']['length'] === 0) {
      Swal.fire('Mensaje', 'Debe ingresar un motivo.', 'warning');
      return;
    }
    let arrayFecha = fecha.split('/');
    let fechaDia = arrayFecha[2] + '-' + arrayFecha[1] + '-' + arrayFecha[0];
    let data = {
      id: this.productividadConductores[i][dia]['idMotivo'],
      idConductor: this.productividadConductores[i].id,
      motivo: this.productividadConductores[i][dia]['motivo'],
      fecha: fechaDia,
      idUsuario: this._userService.user.ID_USER
    }

    this._registerService.registerUpdateMotivoNoProdConductor(data).subscribe(
      (response: any) => {
      // console.log(response);
      }
    );
  }

  filtroPagina () {
    this.productividadConductores = this.productividadTotal.slice(this.desde, this.hasta);
    document.getElementById('Anterior').blur();
    document.getElementById('Siguiente').blur();
  }

  changePage(valor: number, pagina) {
    this.desde = this.desde + valor;
    this.hasta = this.hasta + valor;
    this.pagina = this.pagina + pagina;

    if (this.desde >= this.totalRegistros) {
      this.desde = this.desde - 5;
      this.hasta = this.desde + 5;
    }

    if (this.desde <= 0) {
      this.desde = 0;
    }

    if (this.hasta <= 5) {
      this.hasta = 5;
    }

    if (this.pagina >= this.paginas) {
      this.pagina = this.paginas;
    }
    
    if (this.pagina <= 0) {
      this.pagina = 1;
    }
    
    this.filtroPagina();
  }

  async tableToExcel(tableID, filename = ''){
    let token = await this._userService.validarToken();
    if (!token) {
      return;
    }

    if (this.totalRegistros === 0) {
      Swal.fire('Mensaje', 'No hay registro para exportar.', 'warning');
      return;
    }
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+ ' ' + this.fhDesde + '|' + this.fhHasta + '.xls':'excel_data';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
  }

  // Limpiar busqueda
  clear() {
    this.search = '';
    // this.getProductividad();
  }

  // Activar o desactivar botones de reportes
  activeButtons() {
    if (this.search.length > 0) {
      this.activeButton = true;
    } else {
      this.activeButton = false;
      this.getProductividad();
    }
  }
   
}
