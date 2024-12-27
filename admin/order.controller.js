module.exports.index = async (req, res) => {
    res.render("admin_views/admin_manager_order.ejs", {
        title: "Order"
    })
}