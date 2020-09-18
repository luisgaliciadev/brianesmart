export class DetaPeaje {
    constructor(   
        public ID_PEAJE: number,
        public ID_CONDCUTOR: number, 
        public dni: string, 
        public nombre: string, 
        public MONTO: number, 
        public FECHA: string,
        public ID_DETA_PEAJE?: number
    ) { }
}
