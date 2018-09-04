<template>
    <div>
        <form novalidate class="md-layout md-alignment-center-center login-form" @submit.prevent="validateForm">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
                <md-card-header>
                    <div class="md-title">Login</div>
                </md-card-header>

                <md-card-content>
                    <md-field :class="getValidationClass('username')">
                        <label>Email</label>
                        <md-input name="username" type="email" v-model="form.username"></md-input>
                        <span class="md-error" v-if="!$v.form.username.required">Email is required</span>
                        <span class="md-error" v-else-if="!$v.form.username.email">Invalid email</span>
                    </md-field>
                    <md-field :class="getValidationClass('password')">
                        <label>Password</label>
                        <md-input name="password" type="password" v-model="form.password"></md-input>
                        <span class="md-error" v-if="!$v.form.password.required">Password is required</span>
                    </md-field>
                </md-card-content>
                <md-card-actions>
                    <md-button type="submit">Login</md-button>
                </md-card-actions>
            </md-card>
        </form>

        <md-snackbar :md-position="message.position" :md-duration="message.duration" :md-active.sync="message.show" md-persistent>
            <span>登录成功！</span>
        </md-snackbar>
    </div>
</template>

<script>
    import { LOGIN } from '@/graphql'
    import { validationMixin } from 'vuelidate'
    import {
        required,
        email
    } from 'vuelidate/lib/validators'

    export default {
        data () {
            return {
                form: {
                    username: '',
                    password: '',
                    code: 0
                },
                message: {
                    duration: 3000,
                    position: 'left',
                    show: false,
                    content: ''
                }
            }
        },
        methods: {
            async login () {
                const results = await this.$apollo.mutate({
                    mutation: LOGIN,
                    variables: { form: this.form }
                })

                const { authed: { token, user, message } } = results.data
                if (token && user) {
                    this.showMessage('SUCCESSFULLY LOGINED')
                    localStorage.setItem('token', token)
                    this.$jwt.setToken(token)
                    this.$router.replace('/')
                    // TODO: UPDTAE PROFILE
                } else {
                    this.showMessage(`SOMTHING WRONG - ${message}`)
                    console.error(results.error)
                }
            },
            showMessage () {
                this.message.show = true
            },
            validateForm () {
                this.$v.$touch()
                if (!this.$v.$invalid) {
                    this.login()
                }
            },
            clearForm () {
                this.$v.$reset()
                this.form.username = null
                this.form.password = null
            },
            getValidationClass (fieldName) {
                const field = this.$v.form[fieldName]

                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            }
        },
        mixins: [validationMixin],
        validations: {
            form: {
                username: {
                    required,
                    email
                },
                password: {
                    required
                }
            }
        }
    }
</script>
