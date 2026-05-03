const { default: mongoose } = require("mongoose");
const { default: z } = require("zod");


const productSchema = z.object({
    name: z.string().min(1),
    price: z.number(),
    userId: z.string().refine( (val) => mongoose.Types.ObjectId.isValid(val), {
        error: "Wrong userId provided"
    }),
    desc: z.string().optional(),
    review: z.number().optional()    
})

module.exports = productSchema