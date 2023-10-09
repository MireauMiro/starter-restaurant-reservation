const reservationService = require("../reservations/reservations.service");
const tablesService = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function list(req, res) {
  const tables = await tablesService.list();
  const tablesWithStatus = tables.map(table => {
      return {
          ...table,
          status: table.occupied_count > 0 ? "Occupied" : "Free"
      };
  });
  res.json({ data: tablesWithStatus });
}


const VALID_PROPERTIES = [
  "table_name",
  "party_size",
];

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

const hasRequiredProperties = hasProperties("table_name", "party_size");

async function tableExists(req, res, next) {
  const table = await tablesService.read(req.params.tableId);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table not found.` });
}

async function create(req, res) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const tableId = req.params.tableId;
  const { reservation_id } = req.body.data;

  try {
      // Fetch the table data
      const table = await tablesService.read(tableId);

      if (!table) {
          return res.status(404).json({ error: "Table not found" });
      }

      // Fetch the reservation data
      const reservation = await reservationService.read(reservation_id); // Assuming you have a `read` method in your `reservationService`.

      if (!reservation) {
          return res.status(404).json({ error: "Reservation not found" });
      }

      // Compare party sizes
      if (reservation.party_size > table.party_size) {
          return res.status(400).json({ error: "Reservation party size exceeds table capacity" });
      }

      const data = await tablesService.update(tableId, reservation_id);
      res.json({ data });

  } catch (error) {
      console.error("Error in update function:", error);
      res.status(500).json({ error: error.message });
  }
}

async function lookUp(req, res) {
  const tableId = req.params.tableId;
  try {
      const data = await tablesService.lookUp(tableId);
      res.json({ data });
  } catch (error) {
      console.error("Error in read function:", error);
      res.status(500).json({ error: error.message });
  }
}

async function finish(req, res) {
  const tableId = req.params.tableId;
  const table = await tablesService.read(tableId);

  if (!table) {
      return res.status(404).json({ error: "Table not found" });
  }

  if (!table.reservation_id) {
      return res.status(400).json({ error: "This table is not occupied" });
  }

  try {
      await tablesService.resetTable(tableId);
      res.status(200).json({ data: { status: "success" } });
  } catch (error) {
      console.error("Error in finish function:", error);
      res.status(500).json({ error: error.message });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  lookUp: asyncErrorBoundary(lookUp),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(update),
  ],
  finish: asyncErrorBoundary(finish),
};
