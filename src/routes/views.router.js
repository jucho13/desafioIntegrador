import {Router} from 'express';
import StudentService from '../services/db/students.service.js';
import CourseService from '../services/db/courses.service.js';
import { PRIVATE_KEY } from '../util.js';
import jwt from 'jsonwebtoken';

const studentService = new StudentService();
const courseService = new CourseService();

const router = Router();

//TODO proteger estas vistas

router.get('/students',async(req,res)=>{
    const token= req.cookies.jwtCookieToken;
    if (!token) {
        return res.status(401).send({error: "User not authenticated or missing token."});
    }
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: "Token invalid, Unauthorized!"});
        //Token OK
        req.user = credentials.user;
        console.log(req.user);
    });
    let students = await studentService.getAll();
    console.log(students);
    console.log(`EL ROL DEL USUARIO ES:${req.user.role} `);
    if (req.user.role === 'admin'){
        res.render('students',{students: students});
    }else{
        res.send({message: 'No puedes mirar los alumnos porque no eres admin'});
    }
})

router.get('/courses',async(req,res)=>{
    const token= req.cookies.jwtCookieToken;
    if (!token) {
        return res.status(401).send({error: "User not authenticated or missing token."});
    }
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: "Token invalid, Unauthorized!"});
        //Token OK
        req.user = credentials.user;
        console.log(req.user);
    });
    let courses = await courseService.getAll();
    console.log(courses);
    console.log(`EL ROL DEL USUARIO ES:${req.user.role} `);
    if (req.user.role === 'admin'){
        res.render('courses',{courses});
    }else{
        res.send({message: 'No puedes mirar los cursos porque no eres admin'});
    }
})

export default router;