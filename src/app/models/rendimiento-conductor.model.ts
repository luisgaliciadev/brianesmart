export class RendimientoConductor {
    constructor(   
        public ID: number,
        public NOMBRES: string,
        public DNI: string,
        public DIAS_ASISTIDOS: number,
        public DIAS_PUNTUALES: number,
        public INDICADOR_PUNTUALIDAD: number,
        public PORCENTAJE_PUNTUALIDAD: number,
        public PUNTUACION_PUNTUALIDAD: number,
        public OPERATIVOS_ASIGNADOS: number,
        public FALTAS_OPERATIVOS: number,
        public DIAS_PRODUCTIVOS: number,
        public INDICADOR_OPERATIVO: number,
        public PORCENTAJE_OPERATIVOS: number,
        public PUNTUACION_OPERATIVOS: number,
        public TOTAL_VIAJES: number,
        public INDICADOR_PRODUCCION: number,
        public PORCENTAJE_PRODUCCION: number,
        public PUNTUACION_PRODUCCION: number,
        public PUNTUACION_TOTAL: number,
        public VIAJES_PUERTO: number,
        public VIAJES_INTIPUNKU: number,
        public VIAJES_SALINAS: number,
        public SERVICIOS: number,
        public GUIAS_VIAJES: number,
        public TN: number
    ) { }
}
