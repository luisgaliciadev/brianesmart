import { Component, OnInit } from '@angular/core';
import { UserService, RegisterService } from 'src/app/services/service.index';
// import {FileSaver} from 'file-saver';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformarts-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

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
  loading = false;
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
  pruebaHtml;
  viajes = "viajes"
  anchoTabla = 0;
  prueba = false;

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService
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

    this.pruebaHtml = `
    <div class="form-group">
        <div class="input-group">
            <input [(ngModel)]="search" type="text" class="form-control" placeholder="Buscar" >                        
            <div class="input-group-addon"><i class="mdi mdi-delete-forever pointer" data-toggle="tooltip" data-placement="top" title="Borrar Busqueda"></i></div>
        </div>
    </div>
    `
  }

  ngOnInit(): void {
  }

  getProductividad() {
    this.loading = true;
    this._registerService.getProductividadConductor(this.fhDesde, this.fhHasta).subscribe(
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
        this.loading = false;
      }
    );
  }

  registerUpdateMotivoNoProdConductor(i, dia, fecha) {
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

   // Cambiar pagina de lista de empresas
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

    // this.getGuias(this.search);
    this.filtroPagina();
  }

  // exportToExcel(json: any[], excelFile: string ): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  //   const workbook: XLSX.WorkBook = { 
  //     Sheets: {'data': worksheet},
  //     SheetNames: ['data']
  //   };
  
  //   const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
  //   // call method buffer  and fileName


  // }

  // saveAsExcel(buffer: any, fileName: string) {
  //   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
  //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime + EXCEL_EXT);
  // }

  tableToExcel(tableID, filename = ''){
    if (this.totalRegistros === 0) {
      Swal.fire('Mensaje', 'No hay registro para exportar.', 'warning');
      return;
    }
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+ ' ' + this.fhDesde + '|' + this.fhHasta + '.xls':'excel_data.xls';
    
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

 
}
