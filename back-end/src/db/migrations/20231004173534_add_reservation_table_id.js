
exports.up = function(knex) {
    return knex.schema.table('reservations', (table) => {
      table.integer('table_id').unsigned().references('table_id').inTable('seating_tables').nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('reservations', (table) => {
      table.dropColumn('table_id');
    });
  };
