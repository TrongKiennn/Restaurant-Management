module.exports.index = async (req, res) => {
    res.render("admin_views/admin_index.ejs", {
        title: "Admin"
    })
}