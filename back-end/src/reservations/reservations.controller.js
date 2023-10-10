const reservationsService = require("./reservations.service.js");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { DateTime } = require('luxon');

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "party_size",
  "status",
];

function validateReservationDateAndTime(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;

  // Convert the provided date and time into a DateTime object, interpreted in Pacific Time
  const reservationDateTime = DateTime.fromISO(`${reservation_date}T${reservation_time}`, { zone: 'America/Los_Angeles' });

  // Check if the reservation is on a Tuesday
  if (reservationDateTime.weekday === 2) { // .weekday gives 1 for Monday, 2 for Tuesday, etc.
      return next({
          status: 400,
          message: "closed"
      });
  }

  // Check if the reservation time is outside the range of 10:30AM - 9:30PM
  const reservationHour = reservationDateTime.hour;
  const reservationMinutes = reservationDateTime.minute;
  if (
    (reservationHour < 10) || 
    (reservationHour === 10 && reservationMinutes < 30) || 
    (reservationHour === 21 && reservationMinutes > 30) || 
    reservationHour > 21
  ) {
      return next({
          status: 400,
          message: `Reservations are only allowed between 10:30AM and 9:30PM. You selected ${reservationDateTime.toFormat('yyyy-MM-dd HH:mm')} in Pacific Time`
      });
  }

  next();
}

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
}

const hasRequiredProperties = hasProperties("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "party_size");

async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(req.params.reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: req.params.reservationId });
}

async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

async function list(req, res) {
  const data = await reservationsService.list();
  res.json({ data });
}

async function fetch(req, res) {
  const reservationId = req.params.reservationId;
  const data = await reservationsService.fetch(reservationId);
  if (!data) { // checks if data is null or undefined
    return res.status(404).json({ error: "Reservation not found" });
  }
  res.json({ data });
}

async function search(req, res, next) {
  if (req.query.mobile_number) {
    const { mobile_number } = req.query;

    // Check if the mobile number is valid
    const validMobile = /^(\d{3}-?\d{3}-?\d{4}|\(\d{3}\)\s?\d{3}-?\d{4})$/.test(mobile_number);
    if (!validMobile) {
      return next({ status: 400, message: "The provided mobile number is not valid." });
    }

    const results = await reservationsService.search(mobile_number);
    if (!results || results.length === 0) {
      return next({ status: 404, message: "No reservations found with the provided mobile number." });
    }

    return res.json(results);
  } 
  // Otherwise, fetch the usual list
  const date = req.query.date;
  const data = await reservationsService.list(date);
  res.json({ data });
}

async function read(req, res) {
  const { reservationId } = req.params;
  const data = await reservationsService.read(reservationId);
  if (!data) {
      return res.status(404).json({ error: "Reservation not found" });
  }
  res.json({ data });
}

async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await reservationsService.update(updatedReservation);
  res.json({ data });
}

async function updateStatus(req, res, next) {
  const { reservationId } = req.params;
  const { status } = req.body.data;

  try {
      const updatedReservation = await reservationsService.updateStatus(reservationId, status);
      res.json({ data: updatedReservation });
  } catch (error) {
      next(error);
  }
}

async function destroy(req, res) {
  const { reservation } = res.locals;
  await reservationsService.delete(reservation.reservation_id);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  fetch: asyncErrorBoundary(fetch),
  search: asyncErrorBoundary(search),
  read: asyncErrorBoundary(read),
  create: [
    validateReservationDateAndTime,
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
};
