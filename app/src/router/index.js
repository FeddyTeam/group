import Vue from 'vue'
import Router from 'vue-router'

import ViewBubbles from '@/components/ViewBubbles'
import ViewProfile from '@/components/ViewProfile'
import ViewLogin from '@/components/ViewLogin'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/bubbles',
        component: ViewBubbles
    }, {
        path: '/profile',
        component: ViewProfile
    }, {
        path: '/login',
        component: ViewLogin
    }]
})
