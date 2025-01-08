
const dashboardRouter = require('./dashboard/dashboard.route');
const productRouter = require('./products/products.route');
const createRouter = require("./products/createItem.route");
const orderRouter = require('./orders/order.route');
const customerRouter = require('./customers/customer.route');
const loginRouter = require('./login/login.route');
const logoutRouter = require('./logout/logout.route');


module.exports = (app) => {
    app.use('/admin/login',loginRouter);
    app.use('/admin/logout', loginRouter);
    
    app.use('/admin/dashboard', dashboardRouter);

    app.use("/admin/products", productRouter); // get all products

    app.use("/admin/create", createRouter); // create new product page

    app.use("/admin/login", loginRouter);

    app.use("/admin/orders", orderRouter);
    
    app.use("/admin/customer", customerRouter); 

}