const seating_tables = require("./01-seating_tables.json");

exports.seed = function (knex) {
  // First, truncate the table
  return knex.raw("TRUNCATE TABLE seating_tables RESTART IDENTITY CASCADE")
    .then(function () {
      // Then, seed the table with data from the JSON file
      return knex("seating_tables").insert(seating_tables);
    });
};
