const express = require('express');

const path =require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
require("dotenv").config();
const cors = require('cors');
const multer = require('multer');


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
const searchRouter = require("./customer/search/searchRouter");
const loginRouter=require('./customer/login/loginRouter');
const logoutRouter=require('./customer/logout/logoutRouter');
const categoryRouter=require('./customer/category/categoryRouter');
const homeRouter = require("./customer/home/homeRouter");
const cartRouter = require("./customer/cart/cartRouter");

// Set the view engine to EJS
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views', 'admin_views')
]);
app.set("view engine", "ejs");


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
app.use(cors());  // Enable CORS
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({ extended: true }));
app.use("/dist", express.static("dist"));

app.use("/", homeRouter);

app.use("/register", registrationRouter);
app.use("/login",loginRouter);
<<<<<<< HEAD

app.use("/logout",logoutRouter);


app.use("/logout",logoutRouter)
app.use("/category",categoryRouter)


// Cung cấp thư mục chứa ảnh
app.use('/uploads', express.static('uploads'));
=======
app.use("/logout",logoutRouter);
app.use("/search", searchRouter);
app.use("/category",categoryRouter)
app.use("/cart", cartRouter);

>>>>>>> main


// Call the adminRouter function and pass the app as an argument
const adminRouter = require("./routes/admin/index.route.js");
adminRouter(app);

app.get('/home', (req, res) => {
  res.render('home', { title: 'Trang chủ' });
});

app.get('/home',(req,res)=>{
  res.render('home',{title: 'Home Page - Superstore - GA05'})
 });

const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});



setInterval(() => {
  store.clear().then((length) => {
    console.log(`Cleared ${JSON.stringify(length)} sessions`);
  });
}, 1000000);


