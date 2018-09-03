import Vue from 'vue'
import Router from 'vue-router'

import CMSIndex from '@/components/CMS_Index'
import ViewBubbles from '@/components/ViewBubbles'
import ViewProfile from '@/components/ViewProfile'
import ViewLogin from '@/components/ViewLogin'
import ViewCMS from '@/components/ViewCMS'
import NewsList from '@/components/NewsList'
import NewsEditor from '@/components/NewsEditor'

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
    }, {
        path: '/cms',
        component: ViewCMS,
        children: [{
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
