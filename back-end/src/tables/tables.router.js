const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.list).all(methodNotAllowed);
router.route("/new").post(controller.create).all(methodNotAllowed);
router.route("/:tableId/seat").get(controller.lookUp).put(controller.update).delete(controller.finish).all(methodNotAllowed);

module.exports = router;
