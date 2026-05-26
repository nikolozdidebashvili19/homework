const { z } = require("zod");


const signUpUserSchema = z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    
})

module.exports = signUpUserSchema
