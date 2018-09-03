<template>
    <div class="md-layout">
        <div class="md-layout-item">
            <md-tabs>
                <md-tab id="tab-cms" md-label="Welcome" md-icon="subject" to="/cms" />
                <md-tab id="tab-editor" md-label="Editor" md-icon="edit" to="/cms/news/editor" />
                <md-tab id="tab-news" md-label="News" md-icon="art_track"  to="/cms/news" />
                <md-tab id="tab-projects" md-label="Projects" md-icon="bug_report" to="/cms/news/projects" />
                <md-tab id="tab-posts" md-label="Posts" md-icon="rss_feed" to="/cms/news/posts" />
                <md-tab id="tab-event" md-label="Events" md-icon="cake" to="/cms/news/events" />
                <md-tab id="tab-notice" md-label="Notices" md-icon="info" to="/cms/news/notices" />
                <md-tab id="tab-alert" md-label="Alerts" md-icon="warning" to="/cms/news/alerts" />
                <md-tab id="tab-story" md-label="Stories" md-icon="bookmark" to="/cms/news/stories" />
                <md-tab id="tab-ad" md-label="ADs" md-icon="trending_up" to="/cms/news/ads" />
                <md-tab id="tab-link" md-label="Links" md-icon="link" to="/cms/news/links" />

                <md-tab id="tab-nav" md-label="Navbar" md-icon="menu" to="/cms/news/cms/nav" md-disabled/>
            </md-tabs>
            <md-content>
                <router-view></router-view>
            </md-content>
        </div>
    </div>
</template>

<script>
    import NewsListVue from './NewsList.vue'

    export default {
        data () {
            return {

            }
        },
        components: {
            'news-list': NewsListVue
        }
    }
</script>
