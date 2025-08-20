const rateLimit= require('express-rate-limit')

const limitRequests= rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "Fail",
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports= limitRequests
