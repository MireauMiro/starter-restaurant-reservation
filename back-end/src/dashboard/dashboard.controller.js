const dashboardService = require("./dashboard.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function list(req, res) {
  const data = await dashboardServiceService.list();
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
