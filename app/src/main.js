// vue
import Vue from 'vue'
import App from './App'
import router from './router'
// apollo
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
// muse-ui
// import MuseUI from 'muse-ui'
// import 'muse-ui/dist/muse-ui.css'
// vue-material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
// vue-simplemde
import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'
// custom styles
import '@/styles/index.css'

const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: 'http://localhost:3000/gq',
    credentials: 'include'
})

const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    connectToDevTools: true
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

Vue.use(VueApollo)
// Vue.use(MuseUI)
Vue.use(VueMaterial)
Vue.use(VueSimplemde)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App),
    provide: apolloProvider.provide()
})
