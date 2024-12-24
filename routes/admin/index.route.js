
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./products.route');
const createRouter = require("./createItem.route");

module.exports = (app) => {
    app.use('/admin', dashboardRouter); 
    
    app.use("/admin/products", productRouter); // get all products

    app.use("/admin/create", createRouter); // create new product page
}