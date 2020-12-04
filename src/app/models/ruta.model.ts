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
        public DETA_TIPO_CARGAS?: any[],
        public DETA_PRODUCTOS?: any[],
        public HORA_INICIO?: string,
        public HORA_FIN?: string,
        public KM?: number,
        public IDA_HORAS?: number,
        public RETORNO_HORAS?: number,
        public ORIGEN_HORAS?: number,
        public DESTINO_HORAS?: number,
        public LEADTIME_DIAS?: number,
        public COMBUSTIBLE_GLNS?: number,
        public REDIMIENTO_KM_GLNS?: number,

    ) { }

}
