// vue
import Vue from 'vue'
import App from './App'
import router from './router'
// apollo
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
// vue-material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
// vue-simplemde
import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'
// custom styles
import '@/styles/index.css'

import JwtMgr from '@/lib/jwt-mgr'

Vue.use(JwtMgr)

const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: 'http://localhost:3000/graphql',
    credentials: 'include'
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

Vue.use(VueApollo)
Vue.use(VueMaterial)
Vue.use(VueSimplemde)

Vue.config.productionTip = false

Vue.mixin({
    data () {
        return {
            specialKey: 2018
        }
    },
    computed: {
        g () {
            const hostname = document.location.hostname
            const dev = hostname === 'localhost'
            const host = dev ? `${hostname}:3000` : hostname
            const protocol = dev ? 'http:' : 'https:'

            return {
                dev,
                qiniu: {
                    domains: {
                        'https': 'https://upload-z2.qiniup.com',
                        'http': 'http://upload-z2.qiniup.com'
                    },
                    tokenUrl: `${protocol}//${host}/k/qiniu`
                }
            }
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App),
    provide: apolloProvider.provide()
})
