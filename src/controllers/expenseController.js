const addExpense = (req, res) => {
  res.send("Expense added");
};

const getExpenses = (req, res) => {
  res.send("List of expenses");
};

module.exports = { addExpense, getExpenses };
