const passport = require('passport');
const LocalStrategy=require('passport-local').Strategy;
const validPassword=require('../../customer/Utils/passwordUtils').validPassword;
const loginService = require('./login.services');
const title = "Login - Tastee";

const verifyCallback=async (email, password, done)=>{
    try{
        message =
        "Incorrect Email or Password!.";
        const user= await loginService.findUserByEmail(email);
        if(!user){
            return done(null,false, { message, title });
        }
        if(user.role === true){
            return done(null,false, { message, title });
        }
        const isValid=await validPassword(password,user.password,user.salt);

        if(isValid){
            return done(null,user,{title});
        } else{
            return done(null,false,{message, title});
        }
    } catch(err){
        done(err);
    }
}

passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser(async(userId,done)=>{
    try{
        const user=await loginService.findUserById(userId);
        if(user){
            return done(null,user)
        }
    }catch(err){
        done(err);
    }
})
const strategy = new LocalStrategy(
    {
      usernameField: "email", 
      passwordField: "password", 
    },
    verifyCallback
  );
passport.use(strategy);