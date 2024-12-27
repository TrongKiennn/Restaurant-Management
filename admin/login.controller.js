module.exports.index = async (req, res) => {
    res.render("admin_views/admin_login.ejs", {
        title: "Login"
    })
}