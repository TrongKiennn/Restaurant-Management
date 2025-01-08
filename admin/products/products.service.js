
    const { parse } = require("dotenv");
    const pool = require("../../config/database");

    async function getProductById(id){
        const result = await pool.query(
            `
            SELECT products.*, categories.name as category_name
            FROM products join categories on products.category_id = categories.category_id 
            WHERE deleted = false AND product_id = ${id}
            `
        );

        return result.rows[0];
    }

    // LẤY TẤT CẢ SẢN PHẨM
    async function getAllProduct(){
        const query = `
            SELECT products.*, categories.name as category_name 
            FROM products join categories on products.category_id = categories.category_id 
            WHERE deleted = false
            `;
        const result = await pool.query(query);
        return result.rows;
    }

    // LỌC SẢN PHẨM THEO KEYWORD
    async function getProductsByKeyword(keyword){
        const query = `
            SELECT products.*, categories.name as category_name
            FROM products join categories on products.category_id = categories.category_id
            WHERE deleted = false AND products.name ~* $1
        `;
        const values = [keyword];

        const result = await pool.query(query, values);
        return result.rows;
    }
    //XÓA MỀM
    async function deleteProduct(id){  
        if (isNaN(id)) {
            throw new Error("Invalid product ID");
        }
    
        const result = await pool.query(
            `
            UPDATE products
            SET deleted = true
            WHERE product_id = ${id}
            `
        );
        return result.rowCount > 0;
    }

    // XÓA VĨNH VIỄN
    async function deleteProductForever(id){    
        if (isNaN(id)) {
            throw new Error("Invalid product ID");
        }

        const result = await pool.query(
            `
            DELETE FROM products
            WHERE product_id = $1
            `,
            [id]
        );

        if(result.rowCount === 0){
            throw new Error(`Product with ID ${id} does not exist.`);
        }
        return true;
    }
    // XÓA NHIỀU
    async function deleteMultiProduct(ids){
        if (ids.length === 0) {
            throw new Error("Invalid product ID");
        }


        const query = `
            UPDATE products
            SET deleted = TRUE
            WHERE product_id = ANY($1::int[])
        `;

        const values = [ids];

        const result = await pool.query(query, values);
        return result.rowCount > 0;
    }
//XÓA NHIỀU ITEM VĨNH VIEN
async function deleteMultiForever(ids){
    if (ids.length === 0) {
        throw new Error("Invalid product ID");
    }

    const query = `
        DELETE FROM products
        WHERE product_id = ANY($1::int[])
    `;

    const values = [ids];

    const result = await pool.query(query, values);
    return result.rowCount > 0;
}


// TẠO SẢN PHẨM
    async function createProduct(productData){  

        const query =  `
            INSERT INTO products (name, description, category_id, price, product_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [
            productData.name,
            productData.description || "No description provided",
            productData.category_id,
            productData.price,
            productData.product_url
        ];

        try {
            const result = await pool.query(query, values);

            return result.rows[0];
        } catch (error) {
            console.log("Erorr creating product: ", error);

            throw new Error("Error creating product");
        }
    }


    // Update product
    async function updateProduct(productData){
        const query = `
            UPDATE products
            SET name = $1,
            description = $2, 
            category_id = $3, 
            price = $4, 
            status = $5,
            product_url = $6, 
            discount = $7, 
            is_discount_active = $8
            WHERE product_id = $9
            RETURNING *
        `;
    
        const values = [
            productData.name,
            productData.description,
            productData.category_id,
            productData.price,
            productData.status,
            productData.product_url,
            productData.discount,
            productData.is_discount_active,
            productData.product_id
        ];
    
        try {
            const result = await pool.query(query, values);
    
            return result.rows[0];
        } catch (error) {
            console.log("Error updating product: ", error);
    
            throw new Error("Error updating product");
        }
    }

    // thay đổi trạng thái sản phẩm
async function updateStatus(id, status){
    const query = `
        UPDATE products
        SET status = $1
        WHERE product_id = $2
        RETURNING *
    `

    // console.log(status);
    const values = [status, id];
    const result = await pool.query(query, values);

    return result.rows[0];
}

async function getProductsPaginated(limit, offset) {
    const query = `
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.deleted = false
        ORDER BY p.product_id DESC
        LIMIT $1 OFFSET $2
    `;
    
    const values = [limit, offset];
    const result = await pool.query(query, values);
    return result.rows;
}

async function getTotalProducts() {
    const query = `
        SELECT COUNT(*) as total
        FROM products
        WHERE deleted = false
    `;
    
    const result = await pool.query(query);
    return parseInt(result.rows[0].total);
}



    module.exports = {
        getProductById,
        getAllProduct,
        deleteProduct,
        deleteMultiForever,
        deleteMultiProduct,
        createProduct,
        deleteProductForever,
        updateProduct,
        updateStatus,
        getProductsByKeyword,
        getProductsPaginated,
        getTotalProducts
    }

