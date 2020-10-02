export class Peaje {
    constructor(   
        public ID_ORDEN_SERVICIO: number,
        public CANT_REGISTROS: number, 
        public MONTO_TOTAL: number, 
        public ID_USUARIO_BS: number,
        public OBSERVACION: string,
        public FH_REGISTRO?: string,
        public ESTATUS?: number,
        public ID_PEAJE?: number
    ) { }

}
