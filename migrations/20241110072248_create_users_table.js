/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
	await knex.raw(
		`CREATE TABLE IF NOT EXISTS users (
<<<<<<< HEAD
   Id SERIAL PRIMARY KEY,
    Name TEXT,
    Email TEXT,
    phone TEXT,
    Password TEXT,
    Salt TEXT,
    Create_At TIMESTAMP,
    Update_At TIMESTAMP,
    Role BOOLEAN DEFAULT TRUE
=======
        Id SERIAL PRIMARY KEY,
        Name TEXT,
        Email TEXT,
        phone TEXT,
        Password TEXT,
        Salt TEXT,
        Create_At TIMESTAMP,
        Update_At TIMESTAMP,
        Role BOOLEAN DEFAULT TRUE
>>>>>>> main
);`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS users;`);
};
