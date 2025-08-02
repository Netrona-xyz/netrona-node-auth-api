import { hash, compare } from 'bcrypt';

export default class Cripto {
    static async encrypt (pass) {
        const passHash = await hash(pass, 8);
        return passHash;
    }

    static async verified (pass, passHash) {
        const isOk = await compare(pass, passHash);
        return isOk;
    }
}
