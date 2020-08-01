export class ProductividadOp {
    constructor(     
        public PLACA_TRACTO: string,
        public NOMBRE_CONDUCTOR: string,
        public FH_GUIA: string,
        public GUIA_FECHA: string,
        public NRO_SEMANA: number,
        public ANIO: number,
        public TURNO1: string,
        public TURNO2: string,
        public TURNO3: string,
        public FH_DESDE?: string,
        public FH_HASTA?: string,
        public ID?: number,
    ) { }

}

