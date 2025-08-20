const rateLimit = require('express-rate-limit')



const loginLimit=rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req,res,next) => {
        return res.status(429).json({
            status: 'Fail',
            message: 'Too many login attempts please try again later'
        })
    },
    standardHeaders: true,
    legacyHeaders: false, 

})
module.exports= loginLimit