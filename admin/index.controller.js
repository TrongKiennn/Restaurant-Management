module.exports.index = async (req, res) => {
    res.render("admin/layouts/default", {
        title: "Admin"
    })
}