// Description: 'Products' page controller.
const { restart } = require("nodemon");
const productService = require("./products.service");
const { parse } = require("dotenv");
const { json } = require("express");


module.exports.createItem = async (req, res) => {   

    console.log(req.body);
    console.log(req.file);

        try {  
            const file = req.file;

            if(!file){
                return res.status(400).json({ ok: false, message: 'Please upload a file' });
            }

            const productData = {
                name: req.body.name,
                description: req.body.description,
                category_id: req.body.category_id,
                price: req.body.price,
                product_url: `/uploads/${file.filename}`
            }
            
            console.log(productData);

            const result = await productService.createProduct(productData);
            console.log(result);
            if(result){
                return res.redirect("/admin/products");
            }
            else return res.status(400).json({ok: false, message: "Create product failed"});
        } 
        catch (error) {
            return res.status(500).json({ok: false, message: error.message});
        }
}