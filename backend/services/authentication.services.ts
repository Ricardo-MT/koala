import Usuario from '../models/usuario.model';
import { IPublicUser } from '../interfaces/IUser';
import securePassword from 'secure-random-password';

class AuthenticationService {
    constructor() { }

    public login = async (email: string, password: string): Promise<{ user: IPublicUser, correct: Boolean }> => {
        var correct: Boolean = false;
        try {
            let err, user = await Usuario.findOne({ email: email }).select("+password");
            console.log(user);

            if (err) throw err;

            if (user)
                correct = await user.validPassword(password);

            if (correct) {
                //Quitar todas las propiedades además de estas que no sean públicas.
                let { password, salt, validPassword, encryptPassword, ...publicUser } = user;
                return { user: publicUser, correct: true };
            } else return { user: null, correct: false }
        } catch (e) {
            throw e;
        }
    }
    public register = async (newUser: { name: string, email: string, password: string }): Promise<void> => {
        var correct: Boolean = false;
        try {
            let { email, password, name } = newUser;
            //Generar username
            let username = await this.generateUsername(email);

            //Guardar user
            let user = new Usuario({ ...newUser, username });
            const { salt, hashedPassword, err } = await user.encryptPassword(password);
            user.salt = salt;
            user.password = hashedPassword;

            await user.save();
        } catch (e) {
            throw e;
        }
    }
    //Generate username
    private async generateUsername(email: string) {
        //Generar username
        let username = email.split('@')[0]?.trim();
        //Check username
        let usernamesCount = await Usuario.countDocuments({ username });
        if (usernamesCount > 0)
            username = username + usernamesCount.toString();

        return username;
    }
    //Generar contraseña
    private __generatePassword(username: string, nombre: string, apellidos: string) {
        const predicate = { predicate: x => !x.includes(username) || !x.includes(nombre) || !x.includes(apellidos) }
        const characters = {
            characters: [
                { characters: securePassword.upper, exactly: 2 },
                { characters: securePassword.symbols, exactly: 2 },
                { characters: securePassword.digits, exactly: 2 },
                securePassword.lower
            ]
        };

        return securePassword.randomPassword(characters, predicate);
    }
}

export default new AuthenticationService();