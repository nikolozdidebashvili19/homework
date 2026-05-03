const { default: z } = require("zod");

const userSchema = z.object({
    fullName: z.string('Fullname is requied').min(1)
})

module.exports = userSchema