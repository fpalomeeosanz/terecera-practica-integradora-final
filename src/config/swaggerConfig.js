import { __dirname }  from "../utils.js";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";


const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info:{
            title:"Documentación api fpalomerosanz",
            version: "1.0.0",
            description:"Definicion de endpoints para la API de e-commerce"
        }
    },
    apis:[`${path.join(__dirname,"../docs/**/*.yaml")}`], //Archivos con las especificaciones de las rutas.
};


const swaggerSpecs = swaggerJsDoc(swaggerOptions);

export default swaggerSpecs