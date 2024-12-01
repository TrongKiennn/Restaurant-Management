/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
	await knex.raw(
		`CREATE TABLE IF NOT EXISTS users (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(255) ,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255)
);`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS users;`);
};
