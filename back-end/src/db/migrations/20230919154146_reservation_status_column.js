
exports.up = function(knex) {
    return knex.schema.table('reservations', function(table) {
        table.string('status').defaultTo('booked').nullable();
        // Replace 'string' with the appropriate data type if different. Also, you can add constraints as needed.
      });    
};

exports.down = function(knex) {
    return knex.schema.table('reservations', function(table) {
      table.dropColumn('status');
    });    
};
