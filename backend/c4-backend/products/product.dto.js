 
const { default: z } = require("zod");


const productSchema = z.object({
    name: z.string().min(1),
    price: z.number(),
   
    desc: z.string().optional(),
    review: z.number().optional()    
})

module.exports = productSchema