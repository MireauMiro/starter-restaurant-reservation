const knex = require("../db/connection");

function read(table_id) {
    return knex("seating_tables").select("*").where({ table_id }).first();
  }

function lookUp(tableId) {
    return new Promise((resolve) => {
        resolve({ message: `You've fetched the table with ID: ${tableId}` });
    });
}


  function list() {
    return knex("seating_tables as st")
           .select("st.*")
           .leftJoin("reservations as r", "st.table_id", "r.table_id")
           .count("r.reservation_id as occupied_count")
           .groupBy("st.table_id")
           .orderBy("st.table_name", "asc");
}

function create(table) {
    return knex("seating_tables")
      .insert(table)
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
  }

  function update(table_id, reservation_id) {
    return knex("seating_tables")
    .where({ table_id })
    .update({ reservation_id }, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

async function resetTable(tableId) {
  return knex.transaction(async (trx) => {
      // 1. Get the current reservation_id for the given tableId
      const table = await trx("seating_tables")
                          .select("reservation_id")
                          .where({ table_id: tableId })
                          .first();

      const reservationId = table.reservation_id;

      if (!reservationId) {
          throw new Error("The table is not currently occupied.");
      }

      // 2. Reset the table
      await trx("seating_tables")
          .where({ table_id: tableId })
          .update({ reservation_id: null });

      // 3. Update the status of the reservation to "finished"
      await trx("reservations")
          .where({ reservation_id: reservationId })
          .update({ status: "finished" });
  });
}

module.exports = {
    list,
    read,
    lookUp,
    create,
    update,
    resetTable,
};