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
        if (product) {
            return res.status(200).json({ ok: true, product: product });
        }
        else {
            return res.status(4.00).json({ ok: false, message: "Product not found" });
        }
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
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
        return res.render("admin_views/admin_manager_menu", {
            products: productList
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message,
        });
    }
};

//[GET] LẤY DANH SÁCH SẢN PHẨM THEO KEYWORD
//[GET] LẤY DANH SÁCH SẢN PHẨM THEO KEYWORD
module.exports.getProductsByKeyword = async (req, res) => {
    const keyTerm = req.query.keyword;
    const page = parseInt(req.query.page) || 1;
    const limit = 12; // Items per page
    
    console.log(keyTerm);

    try {
        const productList = await productService.getProductsByKeyword(keyTerm);
        
        if (productList.length === 0) {
            return res.render("admin_views/admin_layouts/no_result", {
                keyword: keyTerm
            });
        }

        // Calculate pagination data
        const totalItems = productList.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = productList.slice(startIndex, endIndex);

        // Create pagination object
        const pagination = {
            page: page,
            totalPages: totalPages,
            hasPrev: page > 1,
            hasNext: page < totalPages
        };

        return res.render("admin_views/admin_manager_menu", { 
            products: paginatedProducts,
            pagination: pagination
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message,
        });
    }
}

//[PATCH] xóa mềm (cập nhật deleted = true)
module.exports.deleteItem = async (req, res) => {

    console.log(req.body);

    const id = parseInt(req.body.id);

    console.log(id);

    try {
        const result = await productService.deleteProduct(id);
        if (result) {
            console.log(result);
            return res.json({ ok: true, message: "Deleted successfully !" });
        }
        return res.status(400).json({ ok: false, message: "Delete product failed" });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
};

//[DELETE] xóa vĩnh viễn
module.exports.deleteItemForever = async (req, res) => {
    const id = parseInt(req.body.id);
    console.log(id);

    try {
        const result = await productService.deleteProductForever(id);
        if (result) {
            req.flash("success", "Deleted successfully !");
            return res.redirect("/admin/products");
        }
        else
            return res.status(400).json({ ok: false, message: "Delete product failed" });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
}
//[DELETE] xóa vĩnh viễn nhiều sp
module.exports.deleteMultiForever = async (req, res) => {
    const ids = req.body.ids;
    console.log(ids);

    try {
        const result = await productService.deleteMultiForever(ids);
        if (result) {
            req.flash("success", "Deleted successfully !");
            return res.status(200).json({ ok: true, message: "Deleted successfully !" });
        }
        return res.status(400).json({ ok: false, message: "Delete products failed" });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
}



//[PATCH]XÓA NHIỀU ITEM 
module.exports.deleteMulti = async (req, res) => {
    const ids = req.body.ids;
    console.log(ids);

    try {
        const result = await productService.deleteMultiProduct(ids);
        if (result) {
            req.flash("success", "Deleted successfully !");
            return res.status(200).json({ ok: true, message: "Deleted successfully !" });
        }
        return res.status(400).json({ ok: false, message: "Delete products failed" });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
}




// [PATCH] cập nhật sản phẩm
module.exports.updateProduct = async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    // const productData = new FormData(req.body);

    // console.log(productData);

    try {
        const isNewImage = req.body.isNewImage === 'true';

        const productData = {
            product_id: parseInt(req.body.product_id),
            name: req.body.name,
            description: req.body.description,
            category_id: parseInt(req.body.category_id),
            price: parseInt(req.body.price),
            status: req.body.status === 'true',
            discount: parseInt(req.body.discount),
            is_discount_active: req.body.is_discount_active === 'true'
        }
        if (isNewImage) {
            if (!req.file) {
                return res.status(400).json({ 
                    ok: false, 
                    message: 'New image upload failed' 
                });
            }
            productData.product_url = `/uploads/${req.file.filename}`;
        } else {
            productData.product_url = req.body.product_url;
        }

        console.log(productData);

        const result = await productService.updateProduct(productData);

        console.log(result);

        if (result) {
            return res.json({
                ok: true,
                message: "Update product successfully",
                redirectUrl: '/admin/products'
            });
        }
        else return res.status(400).json({ ok: false, message: "Create product failed" });
    }
    catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
}

// [PATCH] cập nhật trạng thái sản phẩm
module.exports.updateStatus = async (req, res) => {
    console.log(req.body);
    const id = req.body.id; // id là id của item
    const status = req.body.status === 'true'; // status là trạng thái hiện tại của item

    const changeStatus = !status;

    console.log("Change status: ", changeStatus);
    try {
        const result = await productService.updateStatus(id, changeStatus);
        if (result) {
            console.log(result.product_id + "/" + result.status);
            console.log("Update status successfully !");
            return res.status(200).json({
                ok: true,
                message: "Update status successfully !",
                status: result.status
            });
        }
        return res.status(400).json({ ok: false, message: "Update product failed" });
    }
    catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
}

const productsPerPage = 8;

module.exports.getProducts = async (req, res) => {
    try {
        let page = req.query.page;
        if(page === NaN || page < 1) {
            page = 1;
        }
        page = parseInt(page);
        console.log(page);

        const offset = (page - 1) * productsPerPage; // vi tri bat dau lay
        
        const [products, total] = await Promise.all([
            productService.getProductsPaginated(productsPerPage, offset),
            productService.getTotalProducts()
        ]);

        const totalPages = Math.ceil(total / productsPerPage);

        return res.render("admin_views/admin_manager_menu", {
            title: "Menu",
            products,
            pagination: {
                page,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};