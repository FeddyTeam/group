<template>
    <div>

        <md-button @click="u.dialogUserCreatingVisiblity = true">
            CREATE USER
        </md-button>

        <md-table v-model="users">
            <md-table-toolbar>
                <h1 class="md-title">User Manager</h1>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="THUMBNAIL">
                    <img :src="item.avatar" width="64" height="64">
                </md-table-cell>
                <md-table-cell md-label="USERNAME">{{ item.username }}</md-table-cell>
                <md-table-cell md-label="E-MAIL">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="NAME">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="STATUS">{{ item.status }}</md-table-cell>
                <md-table-cell md-label="ADMIN">
                    <md-chip v-show="item.adm" class="md-accent" md-clickable>ADMIN</md-chip>
                </md-table-cell>
                <md-table-cell md-label="EDITOR">
                    <md-chip v-show="item.cms" class="md-primary" md-clickable>EDITOR</md-chip>
                </md-table-cell>
                <md-table-cell md-label="BASE">
                    <md-chip v-show="item.abc" md-clickable>BASE</md-chip>
                </md-table-cell>
                <md-table-cell md-label="TIME CREATED">{{ item.createdAt }}</md-table-cell>
                <md-table-cell md-label="SETTINGS">
                    <router-link class="md-icon-button" tag="md-button" :to="`/manage/users/${item.id}`">
                        <md-icon>settings</md-icon>
                    </router-link>
                </md-table-cell>
            </md-table-row>
        </md-table>

        <md-dialog :md-active.sync="u.dialogUserCreatingVisiblity">
            <md-dialog-title>CREATE USER</md-dialog-title>
            <md-divider></md-divider>

            <md-dialog-content>
                <md-field>
                    <label>USERNAME</label>
                    <md-input v-model="form.username" type="text"></md-input>
                </md-field>

                <md-field>
                    <label>EMAIL</label>
                    <md-input v-model="form.email" type="email"></md-input>
                </md-field>

                <md-field>
                    <label>PASSWORD</label>
                    <md-input type="text" v-model="form.password" ></md-input>
                    <md-button @click="generatePassword" title="Auto Generate One" class="md-icon-button">
                        <md-icon>vpn_key</md-icon>
                    </md-button>
                </md-field>
            </md-dialog-content>

            <md-divider></md-divider>

            <md-dialog-actions>
                <md-button @click="createUser" md-primary>OK</md-button>
                <md-button @click="clearForm">CANCEL</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-snackbar md-position="left" :md-active.sync="u.messageVisiblity" md-persistent>
            <span>{{u.messageContent}}</span>
        </md-snackbar>
    </div>
</template>

<script>
    import { FETCH_USERS, CREATE_USER } from '@/graphql'

    export default {
        data () {
            return {
                users: [],
                u: {
                    dialogUserCreatingVisiblity: false,
                    messageVisiblity: false,
                    messageContent: ''
                },
                form: {
                    username: '',
                    password: '',
                    email: ''
                }
            }
        },
        methods: {
            log (id, oldVal, val) {
                console.log(id, oldVal, val)
            },
            clearForm () {
                // this.$v.$reset()
                this.form.email = ''
                this.form.username = ''
                this.form.password = ''
                this.u.dialogUserCreatingVisiblity = false
            },
            showMessage (message) {
                this.u.messageContent = message
                this.u.messageVisiblity = true
            },
            generatePassword () {
                const rand = btoa(Math.random() * Date.now()).slice(3, 11)
                this.form.password = rand
            },
            async createUser () {
                try {
                    const results = await this.$apollo.mutate({
                        mutation: CREATE_USER,
                        variables: {
                            user: this.form
                        }
                    })

                    const { data: { user } } = results
                    const users = this.$apollo.data.users

                    this.$apollo.queries.users.setData([
                        user,
                        ...users
                    ])

                    this.showMessage('USER CREATED')
                    this.clearForm()
                } catch (err) {
                    this.showMessage(`SOMTHING WRONG? - ${err.message}`)
                }
            }
        },
        apollo: {
            users: {
                query: FETCH_USERS
            }
        }
    }
</script>

<style>
    .card-box {
        display: flex;
        flex-wrap: wrap;
    }

    .card-box__card {
        flex: 1;
        max-width: 300px;
        min-width: 240px;
        /* height: 160px; */
        margin: 10px;
        /* border: 1px solid #ddd; */
    }
</style>

