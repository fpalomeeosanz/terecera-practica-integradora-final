import mongoose from "mongoose";
import { options } from "./options.js";


export const dbConection = async()=>{
try {
  await mongoose.connect(options.mongo.url)
  console.log("En la BDD:",options.mongo.url);
} catch (error) {
    console.log(`Hubo un error conectandose a la base ${error}`);
}
};
