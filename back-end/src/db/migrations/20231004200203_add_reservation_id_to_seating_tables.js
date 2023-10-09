
exports.up = function(knex) {
    return knex.schema.table('seating_tables', (table) => {
      table.integer('reservation_id').unsigned().references('reservation_id').inTable('reservations').nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('seating_tables', (table) => {
      table.dropColumn('reservation_id');
    });
  };
