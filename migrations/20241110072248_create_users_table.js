/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
	await knex.raw(
		`CREATE TABLE IF NOT EXISTS users (
   Id SERIAL PRIMARY KEY,
    Name TEXT,
    Email TEXT,
    Password TEXT,
    Salt TEXT,
    Create_At TIMESTAMP,
    Update_At TIMESTAMP,
    Role BOOLEAN
);`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS users;`);
};
