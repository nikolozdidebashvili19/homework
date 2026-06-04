const { z } = require("zod");

const signUpDirectorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6).max(20),
  bio: z.string().optional(),
});

module.exports = signUpDirectorSchema;