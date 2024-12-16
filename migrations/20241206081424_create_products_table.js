/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(
		`CREATE TABLE IF NOT EXISTS products (
    Product_Id SERIAL PRIMARY KEY,
    Name TEXT,
    Description TEXT DEFAULT 'No description provided',
    Category_Id INT,
    Price DECIMAL(18, 2),
    Status BOOLEAN DEFAULT TRUE,
    Sold INT DEFAULT 0,
    Avg_Rating FLOAT  DEFAULT 0,
    Product_Url TEXT DEFAULT 'No image provided',
     Deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Category_Id) REFERENCES Categories(Category_Id)

);`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS products;`);
};

