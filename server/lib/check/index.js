const { JWT_SECRET } = process.env
const jwt = require('jsonwebtoken')

module.exports = async ({ ctx, want }) => {
    const authorization = ctx.request.header.authorization
    if (!authorization) {
        throw new Error('JWT: Authorization header not found')
    }

    const results = authorization.split(' ')
    const type = results[0]
    const token = results[1]

    if (type !== 'Bearer') {
        throw new Error('JWT: Bearer type not found')
    }

    const decoded = await jwt.verify(token, JWT_SECRET)
    if (!decoded) {
        throw new Error('JWT: Payload not found')
    }

    const { exp } = decoded
    if (!exp) {
        throw new Error('JWT: Exp not found')
    }

    const now = new Date().getTime()
    if (now > exp * 1000) {
        throw new Error('JWT: Token expired')
    }

    return decoded
}
