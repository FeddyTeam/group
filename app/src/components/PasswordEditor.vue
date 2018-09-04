<template>
    <div class="md-layout">
        <div class="md-layout-item">
            <form @submit.prevent="validateForm">
                <div class="md-card">
                    <div class="md-card-header">CHANGE PASSWORD</div>
                    <md-divider></md-divider>
                    <div class="md-card-content">
                        <md-field :class="getValidationClass('password')">
                            <label>Current Password</label>
                            <md-input type="password" v-model="form.password"></md-input>
                            <span class="md-error" v-show="!$v.form.password.required">The old password is required</span>
                        </md-field>
                        <md-field :class="getValidationClass('newPassword')">
                            <label>New Password</label>
                            <md-input type="password" v-model="form.newPassword"></md-input>
                            <span class="md-error" v-show="!$v.form.newPassword.required">The new password is required</span>
                        </md-field>
                        <md-field :class="getValidationClass('newPassword2')">
                            <label>Repeat New Password</label>
                            <md-input type="password" v-model="form.newPassword2"></md-input>
                            <span class="md-error" v-show="!$v.form.newPassword2.required">The new password is required</span>
                        </md-field>
                    </div>

                    <md-divider></md-divider>

                    <md-card-actions>
                        <md-button type="submit" class="md-primary md-large">UPDATE PASSWORD</md-button>
                        <router-link tag="md-button" to="/profile">CANCEL</router-link>
                    </md-card-actions>

                    <md-snackbar md-position="left" :md-active.sync="u.messageVisiblity" md-persistent>
                        <span>{{u.messageContent}}</span>
                    </md-snackbar>
                </div>
            </form>
        </div>
        <div class="md-layout-item"></div>
    </div>
</template>

<script>
import { UPDATE_PASSWORD, GET_PROFILE } from '@/graphql'
import { validationMixin } from 'vuelidate'
import {
    required
} from 'vuelidate/lib/validators'

export default {
    data () {
        return {
            profile: {
                name: ''
            },
            form: {
                password: '',
                newPassword: '',
                newPassword2: ''
            },
            u: {
                messageVisiblity: false,
                messageContent: ''
            }
        }
    },
    computed: {
        preparedForm () {
            return {
                password: this.form.password,
                newPassword: this.form.newPassword
            }
        }
    },
    methods: {
        clearForm () {
            this.$v.$reset()
            this.form.password = ''
            this.form.newPassword = ''
            this.form.newPassword2 = ''
        },
        showMessage (message) {
            this.u.messageContent = message
            this.u.messageVisiblity = true
        },
        validateForm () {
            this.$v.$touch()
            if (!this.$v.$invalid) {
                this.updatePassword()
            }
        },
        getValidationClass (fieldName) {
            const field = this.$v.form[fieldName]

            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        async updatePassword () {
            try {
                await this.$apollo.mutate({
                    mutation: UPDATE_PASSWORD,
                    variables: {
                        passwords: this.preparedForm
                    }
                })

                this.showMessage('PASSWORD SUCCESSFULLY UPDATED')
            } catch (err) {
                this.showMessage(`SOMTHING WRONG? - ${err.message}`)
            }
        }
    },
    apollo: {
        profile: {
            query: GET_PROFILE
        }
    },
    mixins: [validationMixin],
    validations: {
        form: {
            password: {
                required
            },
            newPassword: {
                required
            },
            newPassword2: {
                required
            }
        }
    }
}
</script>
