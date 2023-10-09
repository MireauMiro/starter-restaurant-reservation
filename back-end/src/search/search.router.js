/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./search.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.search).all(methodNotAllowed);

module.exports = router;
