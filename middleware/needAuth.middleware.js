const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1]

      req.body.user = jwt.verify(token, process.env.JWT_SECRET)

      next()
   } catch (e) {
      return res.status(401).json({ message: 'Not authorized.' })
   }
}