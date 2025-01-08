const customerService = require("../admin/customer.services");


module.exports.index = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomer();

        if (customers) {
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
        const orders = await customerService.getOrderByUserId(id);
        const countOrder = await customerService.countOrder(id);
        const total = await customerService.getTotalPrice(id);
        const customer = await customerService.getDetailCustomer(id);
        if (!customer) {
            return res.status(404).send('Customer not found');
        }
        res.render("admin_views/admin_manager_detailCustomer.ejs", {
            title: "Detail Customer",
            customer: customer,
            total: total,
            countOrder: countOrder,
            orders: orders
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            ok: false,
            message: error.message,
        });
    }
}

// xem chi tiết đơn hàng
module.exports.detailOrder = async (req, res) => {
    const orderId = req.params.id;

    console.log(orderId);
    try {
        const [order, items] = await Promise.all([
            customerService.getDetailOrder(orderId),
            customerService.getItemsFromOrder(orderId)
        ]);

        if (!order) {
            return res.status(404).json({ 
                ok: false, 
                message: 'Order not found' 
            });
        }

        res.json({
            ok: true,
            order: order,
            items: items
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};