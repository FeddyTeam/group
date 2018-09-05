import Vue from 'vue'
import Router from 'vue-router'
import JwtMgr from '@/lib/jwt-mgr'

import CMSIndex from '@/components/CMS_Index'
import ViewBubbles from '@/components/ViewBubbles'
import ViewProfile from '@/components/ViewProfile'
import ProfileEditor from '@/components/ProfileEditor'
import PasswordEditor from '@/components/PasswordEditor'
import ViewLogin from '@/components/ViewLogin'
import ViewCMS from '@/components/ViewCMS'
import NewsList from '@/components/NewsList'
import NewsEditor from '@/components/NewsEditor'
import Login from '@/components/Login'

import ViewAdmin from '@/components/ViewAdmin'
import AdminIndex from '@/components/Admin_Index'
import AdminUsers from '@/components/Admin_Users'
import UserEditor from '@/components/UserEditor'

const jwt = new JwtMgr()

const NO_KEYS = []
const ABC_KEYS = ['abc']
const CMS_KEYS = ['adm', 'cms']
const ADM_KEYS = ['adm']

const lock = (keys) => {
    return {
        meta: {
            lock: keys
        }
    }
}

const need = {
    abc: lock(ABC_KEYS),
    cms: lock(CMS_KEYS),
    adm: lock(ADM_KEYS),
    lgd: lock(NO_KEYS)
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
        ...need.none,
        path: '/profile/edit',
        component: ProfileEditor
    }, {
        ...need.none,
        path: '/profile/password',
        component: PasswordEditor
    }, {
        ...need.adm,
        path: '/manage',
        component: ViewAdmin,
        children: [{
            ...need.adm,
            path: '',
            component: AdminIndex
        }, {
            ...need.adm,
            path: '/manage/users',
            component: AdminUsers
        }, {
            ...need.adm,
            path: '/manage/users/:id',
            component: UserEditor
        }]
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
        if (!jwt.lgd) {
            next(false)
        }

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
