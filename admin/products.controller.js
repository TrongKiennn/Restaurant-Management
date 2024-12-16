// Description: 'Products' page controller.
const { restart } = require("nodemon");
const productService = require("./products.service");
const { parse } = require("dotenv");
const { json } = require("express");


module.exports.getProductById = async (req, res) => {
    const id = parseInt(req.params.id);
    // console.log(id); 
    try {
        const product = await productService.getProductById(id);
        if(product){
            return res.status(200).json({ok: true, data: product});
        }
        else{
            return res.status(400).json({ok: false, message: "Product not found"});
        }
    } catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
}


module.exports.index = async (req, res) => {
  try {
    const productList = await productService.getAllProduct();
    if (productList.length === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "list item are empty" });
    }
    return res.json({ ok: true, data: productList });
  } catch (error) {
    res.status(500).json({
        ok: false,
      message: error.message,
    });
  }
//   const productList = await productService.getAllProduct();
//     res.render('admin/pages/product/products', {
//         title: 'Products',
//         productList: productList
//     });
};

// xóa mềm
module.exports.deleteItem = async (req, res) => {   
    const id = parseInt(req.body.id);
    
    console.log(id);

    try {
        const result = await productService.deleteProduct(id);
        if(result){
            return res.status(200).json({ok: true, message: "Delete product successfully"});    
        }
        return res.status(400).json({ok: false, message: "Delete product failed"});
    } catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
};

// xóa vĩnh viễn
module.exports.deleteItemForever = async (req, res) => {
    const id = parseInt(req.body.id);
    console.log(id);

    try {
        const result = await productService.deleteProductForever(id);
        if(result){
            return res.status(200).json({ok: true, message: "Delete product successfully"});    
        }
        return res.status(400).json({ok: false, message: "Delete product failed"});
    } catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
}

module.exports.deleteMulti = async (req, res) => {  
    const ids = req.body.ids;
    console.log(ids);

    try {
        const result = await productService.deleteMultiProduct(ids);
        if(result){
            return res.status(200).json({ok: true, message: "Delete products successfully"});    
        }
        return res.status(400).json({ok: false, message: "Delete products failed"});
    } catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
}


module.exports.createProduct = async (req, res) => {
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
            return res.status(201).json({ok: true, message: "Create product successfully", product: result.rows[0]});    
        }
        return res.status(400).json({ok: false, message: "Create product failed"});
    } 
    catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
}