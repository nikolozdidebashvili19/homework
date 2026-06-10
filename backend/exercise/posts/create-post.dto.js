const { z } = require("zod");

const postzodSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  desc: z
    .string()
    .min(1, { message: "Description is required" })
    .max(100, { message: "Description cannot exceed 100 characters" }),
});

module.exports = postzodSchema;
