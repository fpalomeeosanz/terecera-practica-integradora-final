import { Router } from "express";
import { verifyEmailTokenMW } from "../middlewares/auth.js";
import usersModel from "../daos/models/usersModel.js";

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

router.get('/profile', publicAccess, (req,res)=>{;
    res.render('profile', {user:req.session.user})
    //res.send(`Bienvenido ${req.user.email} <a href="/">home</a>`)
});

router.get("/forgot-password", (req,res)=>{
    res.render("forgotPassword")
});

router.get('/reset-password', verifyEmailTokenMW(), (req,res)=>{
    const token = req.query.token;
    res.render("resetPassword",{token})
});

router.get("/current", (req, res) => {
    
    const user = req.user;
    res.send(user);

});

router.get('/users', async (req,res) => {
    
    const users = await usersModel.find().lean();
    
    res.render("users", {users, isAdmin: true})
});


export { router as viewsRouter };