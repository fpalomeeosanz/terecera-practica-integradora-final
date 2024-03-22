import { Router } from "express";
import passport from "passport";
import { generateEmailToken, verifyEmailToken, isValidPassword, createHash } from "../utils.js";
import  usersModel  from "../daos/models/usersModel.js";
import { sendRecoveryPass } from "../utils/email.js";

const router = Router();

router.post("/signup", passport.authenticate("signupStrategy",{
    failureRedirect:"/api/sessions/failure-signup"
}), (req,res)=>{
    // res.send("registro exitoso")
    res.redirect("/login");
});

router.get("/failure-signup", (req,res)=>{
    res.send(`<div>Error al registrar al usuario, <a href="/signup">Intente de nuevo</a></div>`);
});

router.post("/login", passport.authenticate("loginStrategy",{
    failureRedirect:"/api/sessions/failure-login"
}), (req,res)=>{
    res.send("login exitoso")
    // res.redirect("/perfil");
});

router.get("/failure-login", (req,res)=>{
    res.send(`<div>Error al loguear al usuario, <a href="/login">Intente de nuevo</a></div>`);
});

router.post("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err) return res.json({status:"error", message:"no se pudo cerrar la sesión"});
        res.json({status:"success", message:"sesion finalizada"});
    });
});

router.post("/forgot-password", async (req,res)=>{
    try {
        const {email} = req.body;
        const user = await usersModel.findOne({email});
        
        if(!user){
            res.send(`<div>Error no existe el usuario, vuelva a intentar: <a href="/forgot-password">Intente de nuevo</a></div>`)
        }
        
        const token = generateEmailToken(email, 60*3);
        console.log('object');
        
        await sendRecoveryPass(email, token);
        res.send("Se envio el correo de recuperacion.")

    } catch (error) {
        
        res.send(`<div>Error,<a href="/forgot-password">Intente de nuevo</a></div>`)
    }

});

router.post("/reset-password", async (req,res)=>{
    try {
        const token = req.query.token;

        const {email, newPassword} = req.body;

        const validToken = verifyEmailToken(token);

        if(!validToken){
            return res.send(`El token ya no es valido`);
        }
        const user = await usersModel.findOne({email});

        if(!user){
            return res.send("el Usuario no esta registrado")   
        }

        if(isValidPassword(newPassword,user)){
            return res.send("no se puede usar la misma contraseña")
        }
        const userData = {
            ...user._doc,
            password:createHash(newPassword)
        }
        const updateUser = await usersModel.findOneAndUpdate({email},userData);

        res.render("login", {message:"Contraseña actualizada"})

    } catch (error) {
        console.log(error);
        res.send(`<div>Error, hable con el administrador.</div>`)
    }

});


export { router as authRouter };