export class AddressClient {

    constructor(
        public ID_CLIENT: number,
        public DS_ADDRESS_CLIENT: string,
        public ADDRESS: string,
        public ID_DISTRITO: number,
        public FG_PRINCIPAL: boolean,
        public ID_DEPARTAMENTO?: number,
        public ID_PROVINCIA?: number,
        public ID_ADDRESS_CLIENT?: number,
        public DS_CLIENT?: string
    ) { }
}
