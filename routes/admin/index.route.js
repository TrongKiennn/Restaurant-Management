
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./products.route');

module.exports = (app) => {
    app.use('/admin', dashboardRouter); 
    app.use("/admin/products", productRouter); // get all products
    app.use("/admin/products/:id", productRouter); // get product by id
    app.use("/admin/products/delete", productRouter); // delete product (soft delete)
    app.use("/admin/products/delete-forever", productRouter); // delete product forever
    app.use("/admin/products/delete-multi", productRouter); // delete multiple products
    app.use("/admin/products/createPage", productRouter); // create new product
    app.use("/admin/products/createItem", productRouter); // create new product
}