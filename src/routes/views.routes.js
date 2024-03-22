import { Router } from "express";
import { verifyEmailTokenMW } from "../middlewares/auth.js";
import usersModel from "../daos/models/usersModel.js";
import productsModel from "../daos/models/productsModel.js";

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

router.get('/profile', (req,res)=>{;
    res.render('profile', {user:req.session.user})
    
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
    const { email, rol } = user; 
    res.render("current", { user: { email, rol } }); 
});

router.get('/users', async (req,res) => {
    
    const users = await usersModel.find().lean();
    
    res.render("users", {users, isAdmin: true})
});

router.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; 
  
    const productos = await productsModel.paginate({}, { page, limit });
  
    res.render('products', { productos });
});

export { router as viewsRouter };