const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} = require("../controllers/transactionController");

const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getTransactions)
  .post(protect, createTransaction);
router.route("/stats").get(protect, getTransactionStats);
router
  .route("/:id")
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
