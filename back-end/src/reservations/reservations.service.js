const knex = require("../db/connection");
const { DateTime } = require('luxon');


function list(date) {
  // If no date is provided, default to today's date in the format YYYY-MM-DD
  const targetDate = date || DateTime.local().toISODate();

  return knex("reservations")
      .select("*")
      .where("reservation_date", targetDate);
}

function fetch(reservation_id) {
  return knex("reservations")
      .select("*")
      .where("reservation_id", Number(reservation_id))
      .first();  
}

function create(reservation) {
  // Set the status field to "booked" before inserting
  reservation.status = "booked";

  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .first();
}

function update(updatedReservation) {
    return knex("reservations")
      .where({ reservation_id: updatedReservation.reservation_id })
      .update(updatedReservation, "*")
      .then((updatedRecords) => updatedRecords[0]);
  }

function updateStatus(reservationId, status) {
  return knex("reservations")
    .where({ "reservation_id": reservationId })
    .update({ "status": status })
    .returning("*")
    .then(updatedRecords => updatedRecords[0]);
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
}

  function destroy(reservation_id) {
    return knex("reservations")
    .where({ reservation_id })
    .del();
  }

module.exports = {
    list,
    fetch,
    create,
    read,
    update,
    updateStatus,
    search,
    delete: destroy,
  };