export class AddressCompany {

    constructor(
        public ID_COMPANY_USER: number,
        public DS_ADDRESS_COMPANY: string,
        public ADDRESS: string,
        public ID_DISTRITO: number,
        public FG_PRINCIPAL: boolean,
        public ID_DEPARTAMENTO?: number,
        public ID_PROVINCIA?: number,
        public ID_ADDRESS_COMPANY?: number,
        public DS_COMPANY?: string
    ) { }
}
