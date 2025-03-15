const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
