
exports.up = function(knex) {
    return knex.schema.createTable("seating_tables", (table) => {
        table.increments("table_id").primary();
        table.string("table_name").notNullable();
        table.integer("party_size").unsigned().notNullable();
          knex.raw('ALTER TABLE seating_tables ADD CONSTRAINT check_party_size CHECK (party_size > 0)');
        table.integer('reservation_id').unsigned().references('reservation_id').inTable('reservations');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable("seating_tables");
};
