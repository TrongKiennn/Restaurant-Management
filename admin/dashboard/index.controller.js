const customerService = require("../customers/customer.services");
const orderService = require("../orders/order.services");


module.exports.index = async (req, res) => {
    try {
        const [revenue, totalOrder, customers] = await Promise.all([
            orderService.getRevenue(),
            orderService.countOrder(),
            customerService.countCustomer()
        ]);


        console.log("Revenue:", revenue);
        console.log("Total order:", totalOrder);
        console.log("Customers:", customers);
        
        res.render("admin_views/admin_index.ejs", {
            title: "Admin",
            revenue: revenue || 0,
            totalOrder: totalOrder || 0,
            customers: customers || 0
        });
    } catch (error) {
        console.error("Error loading dashboard:", error);
        res.status(500).send("Error loading dashboard");
    }
}
