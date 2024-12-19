module.exports.index = async (req, res) => {
    res.render("admin_views/admin_layouts/admin_mainLayout.ejs", {
        title: "Admin"
    })
}