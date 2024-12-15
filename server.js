const express = require('express');
const path =require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
require("dotenv").config();

const {ConnectSessionKnexStore} = require('connect-session-knex'); 
const knexConstructor= require('knex') ;
const knexConfig =require('./knexfile.js');

const knex = knexConstructor(knexConfig[process.env.NODE_ENV || "development"]);

const store = new ConnectSessionKnexStore({
  knex,
  tablename: "sessions",
});


const app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store,
  cookie: { maxAge: 1000000 },
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.message = req.flash('error');
    next();
});

require('./customer/login/passport.js');
app.use(passport.initialize())
app.use(passport.session())


const registrationRouter = require("./customer/registration/registrationRouter");
const loginRouter=require('./customer/login/loginRouter');
const logoutRouter=require('./customer/logout/logoutRouter');
const categoryRouter=require('./customer/category/categoryRouter');
const adminRouter = require('./admin/adminRouter');

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  else{
    res.locals.user=null;
  }
  next();
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({ extended: true }));
app.use("/dist", express.static("dist"));

app.use("/register", registrationRouter);
app.use("/login",loginRouter);
app.use("/logout",logoutRouter)
app.use("/category",categoryRouter)
app.use("/admin", adminRouter);

const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});



setInterval(() => {
  store.clear().then((length) => {
    console.log(`Cleared ${JSON.stringify(length)} sessions`);
  });
}, 1000000);


app.get('/admin_views/admin_index',(req,res)=>{
  res.render('admin_index')
 });