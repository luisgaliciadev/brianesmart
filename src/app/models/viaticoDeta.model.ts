export class ViaticoDeta {
    constructor(    
        public ID_CONDUCTOR: number, 
        public FH_DIA: string,
        public MONTO_TOTAL: number,
        public TURNO1: number,
        public TURNO2?: number,
        public TURNO3?: number,
        public CHECK1?: boolean,
        public CHECK2?: boolean,
        public CHECK3?: boolean,
        public ID_VIATICO?: number,
        public ID_DETA_VIATICO?: number,
    ) { }

}

