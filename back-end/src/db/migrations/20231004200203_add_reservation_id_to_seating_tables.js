
exports.up = function(knex) {
  // This migration was found to be redundant and has been commented out.
  // return knex.schema.table('seating_tables', (table) => {
  //   table.integer('reservation_id').nullable().alter();
  // });
  return Promise.resolve();
};
  
exports.down = function(knex) {
  // This migration was found to be redundant and has been commented out.
  // return knex.schema.table('seating_tables', (table) => {
  //   table.integer('reservation_id').notNullable().alter();
  // });
  return Promise.resolve();
};
