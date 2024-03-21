import { Router } from "express";
import { verifyEmailTokenMW } from "../middlewares/auth.js";

const router = Router();

router.get("/",(req,res)=>{
    res.render("home");
});

router.get("/registro",(req,res)=>{
    res.render("registro")
});

router.get("/login",(req,res)=>{
    res.render("login");
});

router.get("/perfil", (req,res)=>{
    res.send(`Bienvenido ${req.user.email} <a href="/">home</a>`);
});

router.get("/forgot-password", (req,res)=>{
    res.render("forgotPassword")
})

router.get("/reset-password", verifyEmailTokenMW(), (req,res)=>{
    const token = req.query.token;
    res.render("resetPassword",{token})
})

export {router as viewsRouter};