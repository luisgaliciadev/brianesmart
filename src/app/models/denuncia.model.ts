export class Denuncia {
    constructor(        
        public TITULO: string,
        public DESCRIPCION: string,
        public FG_EMPLEADO: boolean,
        public FG_ANONIMATO: boolean,
        public NOMBRES: string,
        public APELLIDOS: string,
        public TELEFONO: string,
        public CORREO: string,
        public HORA_CONTACTO: string,
        public PERSONAS_INVOLUCRADAS: string,
        public ARCHIVO1: string,
        public ARCHIVO2: string,
        public ARCHIVO3: string,
        public ID_DENUNCIA?: number
    ) { }

}

