
    const { parse } = require("dotenv");
    const pool = require("../config/database");

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

    async function getAllProduct(){
        const result = await pool.query(
            `
            SELECT products.*, categories.name as category_name 
            FROM products join categories on products.category_id = categories.category_id 
            WHERE deleted = false
            `
        );
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


    async function createProduct(productData){  
        const { name, description, category_id, price, product_url } = productData;

        const query =  `
            INSERT INTO products (name, description, category_id, price, status, sold, avg_rating, product_url, deleted)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [
            name,
            description || "No description provided",
            category_id,
            price,
            true,
            0,
            0,
            product_url || "No image provided",
            false
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
        const { product_id, name, description, category_id, price, product_url } = productData;
    
        const query = `
            UPDATE products
            SET name = $1, description = $2, category_id = $3, price = $4, product_url = $5
            WHERE product_id = $6
            RETURNING *
        `;
    
        const values = [
            name,
            description || "No description provided",
            category_id,
            price,
            product_url || "No image provided",
            product_id
        ];
    
        try {
            const result = await pool.query(query, values);
    
            return result.rows[0];
        } catch (error) {
            console.log("Error updating product: ", error);
    
            throw new Error("Error updating product");
        }
    }
    module.exports = {
        getProductById,
        getAllProduct,
        deleteProduct,
        deleteMultiProduct,
        createProduct,
        deleteProductForever,
        updateProduct
    }

