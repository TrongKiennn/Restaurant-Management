
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./products.route');
const createRouter = require("./createItem.route");
const loginRouter = require('./login.route');
const orderRouter = require('./order.route');
const customerRouter = require('./customer.route');


module.exports = (app) => {
    app.use('/admin', dashboardRouter);

    app.use("/admin/products", productRouter); // get all products

    app.use("/admin/create", createRouter); // create new product page

    app.use("/admin/login", loginRouter);

    app.use("/admin/orders", orderRouter);
    
    app.use("/admin/customer", customerRouter); 

}