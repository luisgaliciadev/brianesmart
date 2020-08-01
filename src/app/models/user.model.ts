export class User {

    // constructor(
    //     public name: string,
    //     public email: string,
    //     public password: string,
    //     public image?: string,
    //     public role?: string,
    //     public google?: boolean,
    //     // tslint:disable-next-line: variable-name
    //     public _id?: string
    // ) { }

    constructor(
        public NAME: string,
        public EMAIL: string,
        public PASSWORD: string,
        public IMAGE?: string,
        public ID_ROLE?: number,
        public GOOGLE?: boolean,
        public PHONE?: string,
        // tslint:disable-next-line: variable-name
        public ID_USER?: number
    ) { }

// tslint:disable-next-line: eofline
}

