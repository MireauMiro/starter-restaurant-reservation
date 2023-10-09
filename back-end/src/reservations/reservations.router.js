const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.search).all(methodNotAllowed);
router.route("/new").post(controller.create).all(methodNotAllowed);
router.route("/:reservationId").get(controller.fetch).put(controller.update).all(methodNotAllowed);
router.route("/:reservationId/seat").post(controller.create).all(methodNotAllowed);
router.route("/:reservationId/status").put(controller.updateStatus).all(methodNotAllowed);
router.route("/:reservationId/edit").get(controller.read).all(methodNotAllowed);


module.exports = router;
