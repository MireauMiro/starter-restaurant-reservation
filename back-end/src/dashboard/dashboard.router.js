/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./dashboard.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.list);

module.exports = router;
