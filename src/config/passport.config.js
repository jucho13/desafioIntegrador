import passport from "passport";
import passportLocal from "passport-local";
//Para usar JWT como estrategia.
import jwtStrategy from 'passport-jwt'
import { PRIVATE_KEY } from "../util.js";
import userModel from "../services/db/models/user.js";
import studentsModel from "../services/db/models/students.js";
import { createHash } from "../util.js";
import StudentService from "../services/db/students.service.js";

const studentService= new StudentService();
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;
const localStrategy = passportLocal.Strategy;

const initializePassport = () => {
    //TODO generar las reglas para extraer el token y las autorizaciones necesarias.
     //Estrategia de obtener Token JWT por Cookie:
     passport.use('jwt', new JwtStrategy(
        // extraer la  cookie
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        },
        // Ambiente Async
        async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT.");
            try {
                console.log("JWT obtenido del payload");
                console.log(jwt_payload);
                return done(null, jwt_payload.user)// Si todo va bien, nuestro user va estar dentro del jwt_payload
            } catch (error) {
                console.error(error);
                return done(error);
            }
        }

    ));
    //Estrategia de registro de usuario
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { email} = req.body;
            try {
                const exists = await studentService.findByUsername(email);
                if (!exists) {
                    console.log("El usuario no existe.");
                    return done(null, false);
                }
                const user = {
                    email,
                    password: createHash(password)
                };
                const result = await userModel.create(user);
                //Todo sale OK
                return done(null, result);
            } catch (error) {
                return done("Error registrando el usuario: " + error);
            }
        }
    ));
    passport.use('registerStudent', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { name, lastName, email, age, role, courses } = req.body;
            console.log(`Registrando en base de datos student: ${name}, ${lastName}`);
            try {
                const exists = await studentsModel.findOne({email});
                if (exists) {
                    console.log("El student ya existe.");
                    return done(null, false);
                }
                const user = {
                    name,
                    lastName,
                    email,
                    age,
                    password: createHash(password),
                    role,
                    courses
                };
                const result = await studentsModel.create(user);
                //Todo sale OK
                return done(null, result);
            } catch (error) {
                return done("Error registrando el usuario: " + error);
            }
        }
    ));

    //Estrategia de Login de la app:
    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username });
                console.log("Usuario encontrado para login:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + username);
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    console.warn("Invalid credentials for user: " + username);
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

    //Funciones de Serializacion y Desserializacion
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
};

/**
 * Metodo utilitario en caso de necesitar extraer cookies con Passport
 * @param {*} req el request object de algun router.
 * @returns El token extraido de una Cookie
 */
const cookieExtractor = req => {
    let token = null;
    console.log("Entrando a Cookie Extractor");
    if (req && req.cookies) { //Validamos que exista el request y las cookies.
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']; //-> Tener presente este nombre es el de la Cookie.
        console.log("Token obtenido desde Cookie:");
        console.log(token);
    }
    return token;
};

export default initializePassport;