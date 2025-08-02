const mongoose = require("mongoose");

const debtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a debt title"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
      min: 0,
    },
    type: {
      type: String,
      enum: ["lent", "borrowed"], // lent = money you gave, borrowed = money you took
      required: true,
    },
    personName: {
      type: String,
      required: [true, "Please add the person name"],
      trim: true,
    },
    personContact: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "partially_settled", "settled"],
      default: "pending",
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    settlementHistory: [
      {
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    reminderSent: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate remaining amount
debtSchema.virtual("remainingAmount").get(function () {
  return this.amount - this.amountPaid;
});

// Ensure virtual fields are serialized
debtSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Debt", debtSchema);
