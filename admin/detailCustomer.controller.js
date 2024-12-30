module.exports.index = async (req, res) => {
    res.render("admin_views/admin_manager_detailCustomer.ejs", {
        title: "Detail Customer"
    })
}