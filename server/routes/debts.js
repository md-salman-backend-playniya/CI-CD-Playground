const express = require("express");
const router = express.Router();
const {
  getDebts,
  createDebt,
  updateDebt,
  deleteDebt,
  addSettlement,
  getDebtStats,
} = require("../controllers/debtController");

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getDebts).post(protect, createDebt);
router.route("/stats").get(protect, getDebtStats);
router.route("/:id").put(protect, updateDebt).delete(protect, deleteDebt);
router.route("/:id/settle").post(protect, addSettlement);

module.exports = router;
