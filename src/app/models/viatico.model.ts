export class Viatico {
    constructor(   
        public NRO_SEMANA: number,
        public ANIO: number, 
        public ID_ZONA: number, 
        public FH_DESDE: string,
        public FH_HASTA: string,
        public MONTO_TOTAL: number,
        public ID_VIATICO?: number
    ) { }

}
