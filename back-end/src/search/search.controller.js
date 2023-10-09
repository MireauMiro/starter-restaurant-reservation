const searchService = require("./search.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function search(req, res, next) {
  const { mobile_number } = req.query; // Extract mobile_number from query parameters

  if (!mobile_number) {
      return res.status(400).json({ error: 'mobile_number is required' });
  }

  try {
    const results = await searchService.search(mobile_number); // Use the search function from your service.js file
      return res.status(200).json(results); // Send back the search results
  } catch (err) {
      // Handle errors
      console.error(err);
      next(err);
  }
}

module.exports = {
  search: asyncErrorBoundary(search),
};
