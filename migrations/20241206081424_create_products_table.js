/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(
		`CREATE TABLE IF NOT EXISTS products (
    Product_Id SERIAL PRIMARY KEY,
    Name TEXT,
    Description TEXT,
    Category_Id INT,
    Price DECIMAL(18, 2),
    Status BOOLEAN,
    Sold INT,
    Avg_Rating FLOAT,
    Product_Url TEXT,
     Deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Category_Id) REFERENCES Categories(Category_Id)

);`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS products;`);
};

