import express from 'express';
import session from 'express-session';
import __dirname from './util.js';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
//Cookies si aplica:
import cookieParser from 'cookie-parser';
//Passport imports
import passport from 'passport';


//Routers a importar:
import studentRouter from './routes/students.router.js'
import coursesRouter from './routes/courses.router.js'
import viewsRouter from "./routes/views.router.js";
import usersViewRouter from './routes/users.view.router.js'
import jwtRouter from './routes/jwt.router.js'
import initializePassport from './config/passport.config.js';

//Declarando Express para usar sus funciones.
const app = express();

//Preparar la configuracion del servidor para recibir objetos JSON.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * Template engine
 */
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'))

//TODO (Solo si usar Cookies): inicializar el cookie parser.

app.use(cookieParser("CoderS3cr3tC0d3"));

// SESSIONS 
app.use(session({
    //ttl: Time to live in seconds,
    //retries: Reintentos para que el servidor lea el archivo del storage.
    //path: Ruta a donde se buscará el archivo del session store.
  
    // Usando --> session-file-store
    // store: new fileStorage({ path: "./sessions", ttl: 15, retries: 0 }),
  
  
    // Usando --> connect-mongo
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/colegio?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 10 * 60
    }),
  
  
    secret: "coderS3cr3t",
    resave: true, //guarda en memoria
    saveUninitialized: true, //lo guarda a penas se crea
  }));
//TODO: Inicializar passport:

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


//Declaración de Routers:
app.use('/',viewsRouter);
app.use("/api/students", studentRouter);
app.use("/api/courses", coursesRouter);
app.use("/users", usersViewRouter);
app.use("/api/jwt", jwtRouter);

const SERVER_PORT = 9090;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

const connectMongoDB = async ()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/colegio?retryWrites=true&w=majority');
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();