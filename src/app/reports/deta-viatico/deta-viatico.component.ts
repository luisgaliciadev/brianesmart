import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { UserService, RegisterService } from 'src/app/services/service.index';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

declare function init_plugins();

@Component({
  selector: 'app-deta-viatico',
  templateUrl: './deta-viatico.component.html',
  styles: [
  ]
})
export class DetaViaticoComponent implements OnInit {

  detaViatico = []
  totalViaticos = 0;

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService,
    public _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    init_plugins();
    this._route.params.forEach((params: Params) => {     
      this.getDetaViatico(params.id, params.idConductor);
    });
  }

  getDetaViatico(idViatico, idConductor) {

    this._registerService.getDetaViaticoPorConductor(idViatico,idConductor).subscribe(
      (response: any) => {       
        this.detaViatico = response.detalleViatico;
        
        var total = 0
        this.detaViatico.forEach(function(viatico) {
          total = total + viatico.TOTAL;
        });

        this.totalViaticos = total;
      }
    );
  }

  activePrinter() {
    setTimeout(this.printer, 2000);
    this._userService.closeReport();
  }

  printer() {
    window.print();
  }

  toPrint() {
    var contenido= document.getElementById('report').innerHTML;
    var contenidoOriginal= document.body.innerHTML;
    document.body.innerHTML = contenido;
    window.print();
    document.body.innerHTML = contenidoOriginal;
    window.close();
  }

  exportAsPDF()
  {
    let data = document.getElementById('report');  
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'cm', 'letter'); //Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'JPG', 1, 2, 29.7, 15.0);  
      pdf.save('viatico.pdf');   
    }); 
  }
  // 

  // GeneratePDF () {
  //   html2canvas()
  //   html2canvas(this.element.nativeElement, <Html2Canvas.Html2CanvasOptions>{
  //     onrendered: function(canvas: HTMLCanvasElement) {
  //       var pdf = new jsPDF('p','pt','a4');    
  //       var img = canvas.toDataURL("image/png");
  //       pdf.addImage(img, 'PNG', 10, 10, 580, 300);
  //       pdf.save('web.pdf');
  //     }
  //   });
  // }

  // GeneratePDF () {
  //   var contenido= document.getElementById('report');
  //   html2canvas(contenido).then()
  // }

}
