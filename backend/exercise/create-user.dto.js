import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age: z.number().max(100),
});
