
const dashboardRouter = require('./dashboard.route');
const productRouter = require('./products.route');

module.exports = (app) => {
    app.use('/admin', dashboardRouter);
    app.use("/admin/products", productRouter);
    app.use("/admin/products/:id", productRouter);
    app.use("/admin/products/delete", productRouter);
    app.use("/admin/products/delete-forever", productRouter);
    app.use("/admin/products/delete-multi", productRouter);
    app.use("/admin/products", productRouter);// create product
}