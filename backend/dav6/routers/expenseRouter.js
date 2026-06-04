const { Router } = require("express");
const expenseModel = require("../expense/expense.model");
const { CreateExpenseSchema } = require("../expense/create-expense.dto");
const validate = require("../middlewares/validate.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware");

const expenseRouter = new Router();

expenseRouter.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [expenses, total] = await Promise.all([
    expenseModel.find().skip(skip).limit(limit),
    expenseModel.countDocuments(),
  ]);

  res.json({
    data: expenses,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

expenseRouter.get("/:id", validateObjectId, async (req, res) => {
  const expense = await expenseModel.findById(req.params.id);
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }
  res.json(expense);
});

expenseRouter.post("/", validate(CreateExpenseSchema), async (req, res) => {
  const expense = await expenseModel.create(req.body);
  res.status(201).json({ message: "Expense created successfully", expense });
});

expenseRouter.put("/:id", validateObjectId, async (req, res) => {
  const expense = await expenseModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }
  res.json({ message: "Expense updated successfully", expense });
});

expenseRouter.delete("/:id", validateObjectId, async (req, res) => {
  const expense = await expenseModel.findByIdAndDelete(req.params.id);
  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }
  res.json({ message: "Expense deleted successfully" });
});

module.exports = expenseRouter;