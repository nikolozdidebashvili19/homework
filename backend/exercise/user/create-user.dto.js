const { z } = require("zod");

const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age: z.number().max(100),
});

module.exports = { UserSchema };
