const mongoose = require("mongoose");

const incomeSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    sourceName: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      },
    },
    time: {
      type: String,
      default: () =>
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    transactionType: {
      type: String,
      default: "Income",
    },
    active: {
      type: Boolean,
      default: true,
    },
    inactiveAt: {
      type: Date,
      default: () => new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
    },
    icon: {
      type: String,
      default: "none",
    },
    color: {
      type: String,
      default: "grey",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Income", incomeSchema);
