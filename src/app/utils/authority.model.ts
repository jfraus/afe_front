export class Authority {
    authority: string;
    can: string[];
    constructor(authority: string, can: string[]) {
        this.authority = authority;
        this.can = can;
    }
}