// Description: 'Products' page controller.
const { restart } = require("nodemon");
const productService = require("./products.service");
const { parse } = require("dotenv");
const { json } = require("express");

// lấy một sản phẩm theo id
module.exports.getProductById = async (req, res) => {
    const id = parseInt(req.params.id);
    // console.log(id); 
    try {
        const product = await productService.getProductById(id);
        if(product){
           return res.status(200).json({ok: true, product: product});
        }
        else{
            return res.status(4.00).json({ok: false, message: "Product not found"});
        }
    } catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
}

//[GET] LẤY DANH SÁCH SẢN PHẨM
module.exports.index = async (req, res) => {
  try {
    const productList = await productService.getAllProduct();
    if (productList.length === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "list item are empty" });
    }
    return res.render("admin_views/admin_manager_menu",{
        products: productList
    });
  } catch (error) {
    res.status(500).json({
        ok: false,
        message: error.message,
    });
  }
};
 
//[PATCH] xóa mềm (cập nhật deleted = true)
module.exports.deleteItem = async (req, res) => {   
    const id = parseInt(req.body.id);
    
    console.log(id);

    try {
        const result = await productService.deleteProduct(id);
        if(result){
            req.flash("success", "Deleted successfully !");

            return res.status(200).json({ok: true, message: "Deleted successfully !"});    
        }
        return res.status(400).json({ok: false, message: "Delete product failed"});
    } catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
};

//[DELETE] xóa vĩnh viễn
module.exports.deleteItemForever = async (req, res) => {
    const id = parseInt(req.body.id);
    console.log(id);

    try {
        const result = await productService.deleteProductForever(id);
        if(result){
            req.flash("success", "Deleted successfully !");
            return res.redirect("back");
        }
        else 
            return res.status(400).json({ok: false, message: "Delete product failed"});
    } catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
}
//[DELETE] xóa vĩnh viễn nhiều sp
module.exports.deleteMultiForever = async (req, res) => {
    const ids = req.body.ids;
    console.log(ids);

    try {
        const result = await productService.deleteMultiForever(ids);
        if(result){
            req.flash("success", "Deleted successfully !");
            return res.status(200).json({ok: true, message: "Deleted successfully !"});
        }
        return res.status(400).json({ok: false, message: "Delete products failed"});
    } catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
}



//[PATCH]XÓA NHIỀU ITEM 
module.exports.deleteMulti = async (req, res) => {  
    const ids = req.body.ids;
    console.log(ids);

    try {
        const result = await productService.deleteMultiProduct(ids);
        if(result){
            req.flash("success", "Deleted successfully !");
            return res.status(200).json({ok: true, message: "Deleted successfully !"});
        }
        return res.status(400).json({ok: false, message: "Delete products failed"});
    } catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
}


/*
//[GET] render trang tạo sản phẩm mới
module.exports.createPage = async (req, res) => {   
    try {
        return res.render("admin_views/createItem",{
            title: "Create new item"
        });
    } catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
}


//[POST] thêm một sản phẩm mới
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
            return res.redirect("back");
        }
        return res.status(400).json({ok: false, message: "Create product failed"});
    } 
    catch (error) {
        return res.status(500).json({ok: false, message: error.message});
    }
}
*/


// [PATCH] cập nhật sản phẩm
module.exports.updateProduct = async (req, res) => {
    const productData = req.body;

    console.log(productData);

    try{
        const result = await productService.updateProduct(productData);
        if(result){
            return res.redirect("back");
        }
        return res.status(400).json({ok: false, message: "Update product failed"});
    }
    catch(error){
        return res.status(500).json({ok: false, message: error.message});
    }
    finally{
        console.log("Update product successfully !");
    }
}