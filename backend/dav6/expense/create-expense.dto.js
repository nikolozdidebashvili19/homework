const { z } = require("zod");

const CreateExpenseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  amount: z.number().positive({ message: "Amount must be positive" }),
  category: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
});

module.exports = { CreateExpenseSchema };