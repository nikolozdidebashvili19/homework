const { z } = require("zod");

const signUpUserSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(0).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

module.exports = signUpUserSchema;
