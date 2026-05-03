const { default: z } = require("zod")

module.exports = (schema) => {
    return (req, res, next) => {
        const resp = schema.safeParse(req.body ?? {})

        if(!resp.success){
            return res.status(400).json({
                errors: resp.error.issues.map(e => ({
                    message: e.message,
                    path: e.path ? e.path.join(".") : "root"
                }))
            })
        }

        req.body = resp.data
        next()
    }
} 