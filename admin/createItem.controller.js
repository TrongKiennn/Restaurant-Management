// Description: 'Products' page controller.
const { restart } = require("nodemon");
const productService = require("./products.service");
const { parse } = require("dotenv");
const { json } = require("express");


module.exports.createItem = async (req, res) => {
    const productData = req.body;
    console.log(productData);
        // console.log(productData);
        try {  
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