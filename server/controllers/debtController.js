const Debt = require("../models/Debt");

// @desc    Get debts
// @route   GET /api/debts
// @access  Private
const getDebts = async (req, res) => {
  try {
    const { type, status } = req.query;

    let query = { user: req.user.id };

    if (type) query.type = type;
    if (status) query.status = status;

    const debts = await Debt.find(query).sort({ createdAt: -1 });

    res.status(200).json(debts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create debt
// @route   POST /api/debts
// @access  Private
const createDebt = async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      personName,
      personContact,
      description,
      dueDate,
    } = req.body;

    if (!title || !amount || !type || !personName) {
      return res
        .status(400)
        .json({ message: "Please add all required fields" });
    }

    const debt = await Debt.create({
      title,
      amount,
      type,
      personName,
      personContact,
      description,
      dueDate,
      user: req.user.id,
    });

    res.status(201).json(debt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update debt
// @route   PUT /api/debts/:id
// @access  Private
const updateDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({ message: "Debt not found" });
    }

    // Check for user ownership
    if (debt.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedDebt = await Debt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedDebt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete debt
// @route   DELETE /api/debts/:id
// @access  Private
const deleteDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({ message: "Debt not found" });
    }

    // Check for user ownership
    if (debt.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await Debt.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add settlement payment
// @route   POST /api/debts/:id/settle
// @access  Private
const addSettlement = async (req, res) => {
  try {
    const { amount, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Please add a valid amount" });
    }

    const debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({ message: "Debt not found" });
    }

    // Check for user ownership
    if (debt.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Check if amount exceeds remaining debt
    const remainingAmount = debt.amount - debt.amountPaid;
    if (amount > remainingAmount) {
      return res.status(400).json({ message: "Amount exceeds remaining debt" });
    }

    // Add settlement to history
    debt.settlementHistory.push({
      amount,
      note,
      date: new Date(),
    });

    // Update amount paid
    debt.amountPaid += amount;

    // Update status
    if (debt.amountPaid >= debt.amount) {
      debt.status = "settled";
    } else if (debt.amountPaid > 0) {
      debt.status = "partially_settled";
    }

    await debt.save();
    res.status(200).json(debt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get debt statistics
// @route   GET /api/debts/stats
// @access  Private
const getDebtStats = async (req, res) => {
  try {
    const stats = await Debt.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          totalPaid: { $sum: "$amountPaid" },
          count: { $sum: 1 },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
          settled: {
            $sum: {
              $cond: [{ $eq: ["$status", "settled"] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDebts,
  createDebt,
  updateDebt,
  deleteDebt,
  addSettlement,
  getDebtStats,
};
