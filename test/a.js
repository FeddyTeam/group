const jwt = require('jsonwebtoken')
const token = jwt.sign({
    _: 'b7282822-3a66-43de-9f0f-0ad0628a7cf6',
    r: {
        cms: 0,
        bubble: 1
    },
}, 'my-user-id', {
    expiresIn: '1d'
})

const results = jwt.verify(token, 'my-user-id')
console.info(token, results)
