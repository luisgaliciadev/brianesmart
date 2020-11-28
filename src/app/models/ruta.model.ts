export class Ruta {
    constructor(   
        public ID_CLIENTE: number,
        public DS_RUTA: string,
        public ID_MONEDA: number,
        public TARIFA: number,
        public ID_ORIGEN: number, 
        public ID_DESTINO: number,        
        public ID_TIPO_CARGA: number,
        public ID_PRODUCTO: number,
        public OBSERVACION: string,
        public ESTADO: number,   
        public ID_TIPO_COBRO_OS: number,      
        public ID_USUARIO?: number,
        public ID_RUTA?: number,
    ) { }

}
