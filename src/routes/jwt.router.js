import { Router } from 'express';
import {isValidPassword, generateJWToken,createHash} from '../util.js';
//Service import
import StudentService from '../services/db/students.service.js';
import UserService from '../services/db/user.service.js';
import userModel from '../services/db/models/user.js';
import studentsModel from '../services/db/models/students.js';
import passport from 'passport';

const router = Router();
const studentService = new StudentService();
const userService= new UserService();
const StudentModel= new studentsModel();
const UserModel= new userModel();

router.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await studentService.findByUsername(email);
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(400).send({error: "Not found", message: "Usuario no encontrado con username: " + email});
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({status:"error",error:"El usuario y la contraseña no coinciden!"});
        }
        const tokenUser= {
            name : `${user.name} ${user.lastName}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);
        //Con Cookie
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 60000,
            httpOnly: true
        });
        res.send({message: "Login successful!", access_token: access_token});
        //const access_token = generateJWToken(tokenUser); //-->Con access_token
    } catch (error) {
        console.error(error);
        return res.status(500).send({status:"error",error:"Error interno de la applicacion."});
    }
});

//TODO: agregar metodo de registrar estudiante:

router.post("/students", passport.authenticate('registerStudent', { failureRedirect: '/fail-register' }), async (req, res)=>{
    console.log("Registrando nuevo student.");
    res.send({message: 'success'});
});

router.post("/register", passport.authenticate('register', { failureRedirect: '/fail-register' }), async (req, res)=>{
    console.log("Registrando nuevo usuario.");
    res.send("Usuario creado");
});

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

export default router;