import express from "express";
import { dbConection }  from "./config/dbConnection.js";
import { options } from "./config/options.js";
import { engine } from 'express-handlebars';
import { __dirname } from "./utils.js";
import path from "path";

import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./config/passport.config.js";
import swaggerSpecs  from "../src/config/swaggerConfig.js"
import swaggerUi from "swagger-ui-express";

import { authRouter } from "./routes/auth.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { usersRouter } from "./routes/users.routes.js";

//APP
const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//SERVER
const server = app.listen(options.server.port, ()=>{
    console.log('Servidor todavia funcionando en el puerto 8080');
})

//HANDLEBARS
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

//BDD
dbConection();

//SESSION
app.use(session({
    store: MongoStore.create({
        mongoUrl:options.mongo.url
    }),
    secret:options.server.secretSession,
    resave:false,
    saveUninitialized:false
}));

//PASSPORT
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
app.use("/", viewsRouter);
app.use("/api/sessions", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
//SWAGGER
app.use("/api/docs",swaggerUi.serve,swaggerUi.setup(swaggerSpecs));