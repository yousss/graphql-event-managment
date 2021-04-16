const { verify } = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const auth = req.get('Authorization')

  if (!auth) {
    req.isAuth = false
    return next()
  }
  const token = auth.split(' ')[1]

  if (!token || token === '') {
    req.isAuth = false
    return next()
  }
  let decodedToken = ''
  try {
    decodedToken = verify(token, 'superSecret')
  } catch (error) {
    req.isAuth = false
    return next()
  }
  if (!decodedToken) {
    req.isAuth = false
    return next()
  }
  req.isAuth = true
  req.userId = decodedToken.userId
  next()
}
