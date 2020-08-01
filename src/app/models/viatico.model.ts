export class Viatico {
    constructor(   
        public ID_ZONA: number,     
        public ID_CONDUCTOR: string,
        public NRO_SEMANA: number,
        public FH_DESDE: string,
        public FH_HASTA: string,
        public FH_DIA: string,
        public MONTO_TOTAL: number,
        public MONTO1: number,
        public MONTO2?: number,
        public MONTO3?: number,
        public ID_VIATICO?: number
    ) { }

}
