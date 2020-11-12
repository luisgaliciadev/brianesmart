import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-integracion-qwantec',
  templateUrl: './integracion-qwantec.component.html',
  styles: [
  ]
})
export class IntegracionQwantecComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  sicronizarEmpleados() {
    let data;

    data = {
        "apiKey": "414c9895ebcd991b6028ea8020416200",
        "empleados": [
          {
            "codigo": "17823288",
            "rut": "17823288",
            "codigoFicha": "17823288",
            "nombres": "PRUEBA",   
            "apellidos": "PRUEBA",
            "nombreEnReloj": "PPRUEBA",
            "email": "devbriane@gmail.com",
            "fechaNacimiento": "1986-12-12",
            "nacionalidad": null,
            "genero": 1,
            "cargo": "Programador",
            "comentario": "",
            "fechaContrato": "2020-05-04",
            "fechaFinContrato": null,
            "direccion1": "Alameda",
            "direccion2": "123",
            "ciudad": "Lima",
            "telefonoFijo": null,
            "telefonoMovil": "+56912121212",
            "sucursal": "Matriz",
            "departamento": "Departamento inicial",                                                        
            "aliasCompania": null,
            "estado": true
          }
        ]
    }
  }
  

}
