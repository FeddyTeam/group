<template>
    <div id="app">
        <div class="page-container">
            <md-app>
                <md-app-toolbar class="md-primary">
                    <div class="md-toolbar-row">
                        <h3 class="md-title">Feddy Team / Group</h3>
                    </div>
                </md-app-toolbar>

                <md-app-drawer :md-active.sync="menuVisible" md-permanent="clipped">
                    <md-toolbar class="md-transparent" md-elevation="0">
                        Navigation
                    </md-toolbar>

                    <md-list>
                        <router-link tag="md-list-item" to="/bubbles">
                            <md-list-item>
                                <md-icon>mood</md-icon>
                                <span class="md-list-item-text">Bubbles</span>
                            </md-list-item>
                        </router-link>

                        <router-link tag="md-list-item" to="/profile">
                            <md-list-item>
                                <md-icon>account_circle</md-icon>
                                <span class="md-list-item-text">Profile</span>
                            </md-list-item>
                        </router-link>

                        <router-link tag="md-list-item" to="/cms">
                            <md-list-item>
                                <md-icon>subject</md-icon>
                                <span class="md-list-item-text">CMS</span>
                            </md-list-item>
                        </router-link>

                        <router-link tag="md-list-item" to="/login">
                            <md-list-item>
                                <md-icon>account_circle</md-icon>
                                <span class="md-list-item-text">Login</span>
                            </md-list-item>
                        </router-link>
                    </md-list>
                </md-app-drawer>

                <md-app-content>
                    <router-view></router-view>
                </md-app-content>
            </md-app>
        </div>
    </div>
</template>

<script>
export default {
    name: 'app',
    data () {
        return {
            menuVisible: true
        }
    },
    computed: {
        keys () {
            return this.$jwt.keys
        }
    }
}
</script>

<style>
.md-app {
    height: 100vh;
}

.md-app-drawer {
    width: 240px;
}
</style>


