
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./products.route');
const createRouter = require("./createItem.route");

module.exports = (app) => {
    app.use('/admin', dashboardRouter); 
    
    app.use("/admin/products", productRouter); // get all products
    app.use("/admin/products/:id", productRouter); // get product by id

    app.use("/admin/products/delete", productRouter); // delete product (soft delete)
    app.use("/admin/products/delete-forever", productRouter); // delete product forever
    app.use("/admin/products/delete-multi", productRouter); // delete multiple products
    app.use("/admin/products/delete-multi-forever", productRouter); // delete multiple products forever

    app.use("/admin/create", createRouter); // create new product page
}