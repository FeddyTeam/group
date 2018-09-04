import Vue from 'vue'
import Router from 'vue-router'
import JwtMgr from '@/lib/jwt-mgr'

import CMSIndex from '@/components/CMS_Index'
import ViewBubbles from '@/components/ViewBubbles'
import ViewProfile from '@/components/ViewProfile'
import ViewLogin from '@/components/ViewLogin'
import ViewCMS from '@/components/ViewCMS'
import NewsList from '@/components/NewsList'
import NewsEditor from '@/components/NewsEditor'
import Login from '@/components/Login'

const jwt = new JwtMgr()

const NO_KEYS = []
const ABC_KEYS = ['abc']
const CMS_KEYS = ['adm', 'cms']
const RSS_KEYS = ['rss', 'cms']
const ADM_KEYS = ['adm']

const lock = (keys) => {
    return {
        meta: {
            lock: keys
        }
    }
}

const need = {
    none: lock(NO_KEYS),
    abc: lock(ABC_KEYS),
    cms: lock(CMS_KEYS),
    adm: lock(ADM_KEYS),
    rss: lock(RSS_KEYS)
}

const unlock = (lock, keys) => {
    if (!lock) {
        return true
    }

    if (lock.length === 0 && keys) {
        return true
    }

    for (let i = 0; i < lock.length; i++) {
        const current = lock[0]
        if (keys[current]) {
            return true
        }
    }

    return false
}

Vue.use(Router)

const router = new Router({
    routes: [{
        meta: {
            lock: ['spc']
        },
        path: '/login/old',
        component: ViewLogin
    }, {
        path: '/login',
        component: Login
    }, {
        ...need.abc,
        path: '/bubbles',
        component: ViewBubbles
    }, {
        ...need.none,
        path: '/profile',
        component: ViewProfile
    }, {
        ...need.cms,
        path: '/cms',
        component: ViewCMS,
        children: [{
            ...need.cms,
            path: '',
            component: CMSIndex
        }, {
            path: 'news',
            component: NewsList,
            props: { type: 'news' }
        }, {
            path: 'news/posts',
            component: NewsList,
            props: { type: 'post' }
        }, {
            path: 'news/projects',
            component: NewsList,
            props: { type: 'project' }
        }, {
            path: 'news/stories',
            component: NewsList,
            props: { type: 'story' }
        }, {
            path: 'news/notices',
            component: NewsList,
            props: { type: 'notice' }
        }, {
            path: 'news/alerts',
            component: NewsList,
            props: { type: 'alert' }
        }, {
            path: 'news/events',
            component: NewsList,
            props: { type: 'event' }
        }, {
            path: 'news/links',
            component: NewsList,
            props: { type: 'link' }
        }, {
            path: 'news/ads',
            component: NewsList,
            props: { type: 'ad' }
        }, {
            path: 'news/editor',
            component: NewsEditor
        }, {
            path: 'news/editor/:newsId',
            component: NewsEditor,
            props: { mode: 'editing' }
        }]
    }]
})

router.beforeEach((to, from, next) => {
    jwt.readToken()
    const { lock } = to.meta

    if (lock) {
        console.log('========================================')
        console.log(`Lock is ${lock.join(', ')}`)
        console.log(`My keys are ${Object.keys(jwt.keys).join(', ')}`)
        console.log('========================================')
        next(unlock(lock, jwt.keys))
    } else {
        next(true)
    }
})

export default router
