const { isValidObjectId } = require("mongoose")

module.exports = (req, res, next) => {
    if(!isValidObjectId(req.params.id)){
        return res.status(400).json({message: "wrong id provided"})
    }

    next()
}