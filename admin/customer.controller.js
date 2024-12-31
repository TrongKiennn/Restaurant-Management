const customerService = require("../admin/customer.services");

module.exports.index = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomer();

        if(customers){
            res.render("admin_views/admin_manager_customer.ejs", {
                title: "Customer",
                customers: customers
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message,
        });
    }
}

// xem chi tiết khách hàng
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    console.log(id);

    try {
        const customer = await customerService.getDetailCustomer(id);
        if(customer){
            res.render("admin_views/admin_manager_detailCustomer.ejs", {
                title: "Customer",
                customer: customer
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message,
        });
    }
}