// Description: 'Products' page controller.
const { restart } = require("nodemon");
const productService = require("./products.service");
const { parse } = require("dotenv");
const { json } = require("express");


module.exports.createPage = async (req, res) => {   // trang tao san pham
    res.render("admin_views/createItem",
        {
            title: "Create new item"
        });
}

module.exports.createItem = async (req, res) => {
    const productData = req.body;
        // console.log(productData);
        try {
            if(!productData.name || !productData.category_id || !productData.price){
                return res.status(400).json({ok: false, message: "Please enter all fields"});
            }
            // const product = await productService.getProductByName(name);
            // if(product){
            //     return res.status(400).json({ok: false, message: "Product already exists"});
            // }  
            const result = await productService.createProduct(productData);
            console.log(result);
            if(result){
                return res.redirect("/admin/products");
            }
            return res.status(400).json({ok: false, message: "Create product failed"});
        } 
        catch (error) {
            return res.status(500).json({ok: false, message: error.message});
        }
}