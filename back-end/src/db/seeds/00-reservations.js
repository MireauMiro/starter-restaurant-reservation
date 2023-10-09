const reservations = require("./00-reservations.json");

exports.seed = function (knex) {
  // First, truncate the table
  return knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(function () {
      // Then, seed the table with data from the JSON file
      return knex("reservations").insert(reservations);
    });
};
