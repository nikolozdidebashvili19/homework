const { z } = require("zod");

const signInDirectorSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6).max(20),
});

module.exports = signInDirectorSchema;