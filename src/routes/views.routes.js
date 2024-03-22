import { Router } from "express";
import { verifyEmailTokenMW } from "../middlewares/auth.js";

const router = Router();

const publicAccess = (req,res,next) =>{
    if(req.session.user){
        return res.redirect('/');
    }
    next();
}

const privateAccess = (req,res,next) =>{
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
}

router.get('/register', publicAccess, (req,res)=>{
    res.render('register')
});

router.get('/', publicAccess, (req,res)=>{
    res.render("home");
});

router.get('/login', publicAccess, (req,res)=>{
    res.render('login')
});

router.get('/profile', (req,res)=>{
    res.send(`Bienvenido ${req.user.email} <a href="/">home</a>`);
});

//aplicar

router.get("/forgot-password", (req,res)=>{
    res.render("forgotPassword")
});

router.get('/reset-password', verifyEmailTokenMW(), (req,res)=>{
    const token = req.query.token;
    res.render("resetPassword",{token})
});


export { router as viewsRouter };