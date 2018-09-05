<template>
    <div class="md-layout">
        <div class="md-layout-item">

            <div class="md-card">
                <div class="md-card-header">EDIT USER - ID:{{user.id}}</div>
                <md-divider></md-divider>
                <div class="md-card-content">
                    <md-avatar>
                        <img :src="user.avatar" alt="Avatar">
                    </md-avatar>
                </div>
                <md-divider></md-divider>
                <div class="md-card-content">
                    <md-field>
                        <label>Email</label>
                        <md-input v-model="user.email"></md-input>
                    </md-field>
                    <md-field>
                        <label>Name</label>
                        <md-input v-model="user.name"></md-input>
                    </md-field>
                    <md-field>
                        <label>Username</label>
                        <md-input v-model="user.username"></md-input>
                    </md-field>
                    <md-field>
                        <label>STATUS</label>
                        <md-select v-model="user.status">
                            <md-option :value="item" v-for="item in UserStatus">{{item}}</md-option>
                        </md-select>
                    </md-field>
                    <md-switch v-model="user.adm">IS ADMIN?</md-switch>
                    <md-switch v-model="user.cms">IS EDITOR?</md-switch>
                    <md-switch v-model="user.abc">IS BASIC?</md-switch>
                </div>

                <md-divider></md-divider>

                <md-card-actions>
                    <md-button @click="deleteUser" class="md-accent md-large">DELETE USER</md-button>
                    <md-button @click="updateUser" class="md-primary md-large">SAVE</md-button>
                    <router-link tag="md-button" to="/manage/users">CANCEL</router-link>
                </md-card-actions>

                <md-snackbar md-position="left" :md-active.sync="u.messageVisiblity">
                    <span>{{u.messageContent}}</span>
                </md-snackbar>
            </div>

        </div>
        <div class="md-layout-item"></div>
    </div>
</template>

<script>
    import { FETCH_USER, UPDATE_USER } from '@/graphql'
    import { pick } from 'lodash'

    export default {
        data () {
            return {
                u: {
                    messageVisiblity: false,
                    messageContent: ''
                },
                user: {
                    username: '',
                    email: '',
                    name: '',
                    status: '',
                    adm: false,
                    cms: false,
                    abc: false
                }
            }
        },
        computed: {
            id () {
                return this.$route.params.id || null
            },
            preparedForm () {
                return pick(this.user, ['id', 'username', 'name', 'email', 'status', 'adm', 'cms', 'abc'])
            },
            UserStatus: () => ['pending', 'actived', 'deleted', 'locked']
        },
        methods: {
            showMessage (message) {
                this.u.messageVisiblity = true
                this.u.messageContent = message
            },
            setFormValues (name, value) {
                this.user[name] = value
            },
            deleteUser () {
                this.user.status = 'deleted'
                this.showMessage('Status of user, changed to *deleted*, please save.')
            },
            async fetchUser () {
                try {
                    const results = await this.$apollo.query({
                        query: FETCH_USER,
                        variables: {
                            id: this.id
                        }
                    })

                    const { data: { user } } = results
                    this.user = {
                        ...this.user,
                        ...user
                    }
                } catch (err) {
                    this.showMessage(`SOMETHING WRONG? - ${err.message}`)
                }
            },
            async updateUser () {
                try {
                    const results = await this.$apollo.mutate({
                        mutation: UPDATE_USER,
                        variables: {
                            user: this.preparedForm
                        }
                    })

                    const { data: { user } } = results
                    this.user = {
                        ...this.user,
                        ...user
                    }

                    this.showMessage(`SUCCESSFULLY UPDATED`)
                } catch (err) {
                    this.showMessage(`SOMETHING WRONG? - ${err.message}`)
                }
            }
        },
        created () {
            this.fetchUser()
        }
    }
</script>
