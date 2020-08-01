export class Guia {
    constructor(   
        public ID_ORDEN_SERVICIO: string,     
        public FECHA: string,
        public FH_TRASLADO: string,
        public FECHA_HORA_FIN: string,
        public ID_CONDUCTOR: number,
        public ID_TRACTO: number,
        public ID_REMOLQUE: number,
        public PESO_BRUTO: number,
        public PESO_TARA: number,
        public PESO_NETO: number,
        public NRO_PERMISO: string,
        public NRO_GUIA_CLIENTE: string,
        public SERIAL: string,
        public CORRELATIVO: string,
        public OBSERVACION: string,
        public TIEMPO_VIAJE: number,
        public ID_USUARIO_BS: number,
        public ID_GUIA?: number,
        public PLACA_TRACTO?: string,
        public PLACA_REMOLQUE?: string,
        public IDEN_CONDUCTOR?: string,
        public TIPO_EMPRESA?: string,
        public ID_EMPRESA?: number,
    ) { }

}
