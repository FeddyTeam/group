const _parsetToken = raw => {
    if (!raw) {
        throw new Error('Token not found')
    }

    const splited = raw.split('.')
    if (splited.length !== 3) {
        throw new Error('Token is invalid')
    }

    const payload = splited[1]
    try {
        const parsed = atob(payload)
        return JSON.parse(parsed)
    } catch (e) {
        throw new Error(`Token payload is invalid: ${e.message}`)
    }
}

export default class JwtMgr {
    constructor (options) {
        this._payload = {}
        this._opts = options || {
            source: 'localStorage',
            name: 'token'
        }
    }

    readToken () {
        const { source, name } = this._opts
        const _token = window[source].getItem(name)
        this.setToken(_token)
    }

    get payload () {
        return this._payload
    }

    get outDated () {
        if (!this.payload.exp) {
            this.readToken()
        }

        const now = new Date().getTime()
        const exp = this.payload.exp * 1000

        return exp >= now
    }

    get ok () {
        return !this.outDated
    }

    get exp () {
        return this.payload.exp || 0
    }

    get keys () {
        return this.payload.keys || {}
    }

    get token () {
        return this._token
    }

    get authorization () {
        return `Bearer ${this.token}`
    }

    clear () {
        this._token = ''
        this._payload = {}
        const { source, name } = this._opts
        window[source].setItem(name, '')
    }

    setToken (token) {
        if (!token) {
            this.clear()
            return
        }
        const payload = _parsetToken(token)
        this._token = token
        this._raw = token
        this.setPayload(payload)
    }

    setPayload (payload) {
        this._payload = payload
    }

    static install (Vue, options) {
        const jwt = new JwtMgr(options)
        jwt.readToken()

        Vue.prototype.$jwt = jwt
    }
}
