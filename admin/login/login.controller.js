const loginService = require('./login.services');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const validPassword=require('../../customer/Utils/passwordUtils').validPassword;
const utils=require('../utils/jwtUtils');
const title = "Login - Supershop - GA05";

async function handleLoginRequest(req, res, next) {
    try{
        const {email, password} = req.body;
        const user= await loginService.findUserByEmail(email);
        if(!user){
            message =
                "Incorrect Email or Password!.";
            return res.render("login", { message, title });
        }
        const isValid=await validPassword(password,user.password,user.salt);

        if(isValid){
            const tokenObject = utils.issueJWT(user);
            res.cookie('token', tokenObject.token, {
                httpOnly: false, 
                secure: true,   
                maxAge: 3600000 
            });
            
            return res.redirect('/admin/login');
        }
        else {
            message =
                "Incorrect Email or Password!.";
            return res.render("login", { message, title});
        }
    }
    catch(err){
        return next(err);
    }
        
}

async function renderLoginPage(req, res) {
    try {
        message="";
        const user = req.session.user || null;
        res.render('admin_views/admin_login.ejs', {
            title,
            user: user,
        });
    } catch (error) {
        console.error('Error handler login:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        );
    }
}

module.exports = {
    handleLoginRequest,
    renderLoginPage,
};
