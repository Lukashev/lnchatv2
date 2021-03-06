import jwtAuth from 'socketio-jwt-auth'
import User from '@root/models/User'
import config from '@root/config'

export default () => {
  return jwtAuth.authenticate({
    secret: config.JWT_SECRET,
    algorithm: 'HS256'
  }, async (payload, done) => {
    try {
      const user = await User.findById(payload.id)
      if (!user) {
        return done(null, false, 'User does not exist')
      }
      return done(null, user)
    } catch (e) {
      return done(err)
    }
  })
}
