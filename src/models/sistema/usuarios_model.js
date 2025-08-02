import Cripto from '../../middleware/bcrypt_handle.js';

/**
 * Define los datos de un Usuario {id, nombre, mail, password} y sus metodos
 */
export default class Usuarios {
    id; // int         -- pk autoIncrement
    nombre; // string(30)
    mail; // string(60)  -- unique
    password; // string(64)

    /**
     * Convierte la fila extraida de la tabla de usuarios en el objeto de la clase Usuarios
     * Tener en cuenta que este objeto tiene la password encriptada
     * @param {Object} userToAdd - fila del SELECT de usuarios
     */
    constructor (userToAdd) {
        this.id = userToAdd.id;
        this.nombre = userToAdd.nombre;
        this.mail = userToAdd.mail;
        this.password = userToAdd.password;
    }

    /**
     * Metodo que devuelve el objeto publicable del usuario
     * En este caso sin clave
     * @returns {Object} - id / nombre / mail
     */
    toJson () {
        return {
            id: this.id,
            nombre: this.nombre,
            mail: this.mail
        };
    }

    /**
     * Convierte un objeto de usuario recibido en un formato valido para insertar:
     * desconoce campos que sobren y encripta la password
     * @param {{mail, nombre, password}} user - objeto de usuario recibido de la request
     * @returns
     */
    static async toAdd (user) {
        if (typeof user.password === 'number') {
            user.password = user.password.toString();
        }
        const encriptedPassword = await Cripto.encrypt(user.password);
        return {
            nombre: user.nombre,
            mail: user.mail,
            password: encriptedPassword
        };
    }

    /**
     * Valida usando bcript que la clave recibida coincida con la encriptada que está en el regiistro del usuario
     * @param {String} pass - Password del usuario (no encriptada)
     * @param {Usuarios} user - objeto de usuario con password encriptada
     * @returns {boolean} isOk - true si coinciden las passwords false si no
     */
    static async validaPassword (pass, user) {
        const isOk = await Cripto.verified(pass, user.password);
        return isOk;
    }
}
