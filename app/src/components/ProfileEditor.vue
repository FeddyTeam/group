<template>
    <div class="md-layout">
        <div class="md-layout-item">

            <div class="md-card">
                <div class="md-card-header">EDIT PROFILE</div>
                <md-divider></md-divider>
                <div class="md-card-content">
                    <avatar-editor :url="profile.avatar" :set-url="updateAvatar"></avatar-editor>
                </div>
                <md-divider></md-divider>
                <div class="md-card-content">
                    <md-field>
                        <label>Email</label>
                        <md-input @change="event => setFormValues('email', event)" :value="profile.email"></md-input>
                    </md-field>
                    <md-field>
                        <label>Name</label>
                        <md-input @change="event => setFormValues('name', event)" :value="profile.name"></md-input>
                    </md-field>
                    <md-field>
                        <label>Bio</label>
                        <md-input @change="event => setFormValues('bio', event)"  :value="profile.bio"></md-input>
                    </md-field>
                    <md-field>
                        <label>Website</label>
                        <md-input @change="event => setFormValues('url', event)"  :value="profile.url"></md-input>
                    </md-field>
                    <md-datepicker ref="birthdayPicker" :value="profile.birthday" md-immediately :md-disabled-dates="dateFilter">
                        <label>Birthday</label>
                    </md-datepicker>
                </div>

                <md-divider></md-divider>

                <md-card-actions>
                    <md-button @click="updateProfile" class="md-primary md-large">UPDATE YOUR PROFILE</md-button>
                    <router-link tag="md-button" to="/profile">CANCEL</router-link>
                </md-card-actions>

                <md-snackbar :md-position="message.position" :md-duration="message.duration" :md-active.sync="message.show" md-persistent>
                    <span>更新成功！</span>
                </md-snackbar>
            </div>

        </div>
        <div class="md-layout-item"></div>
    </div>
</template>

<script>
import { GET_PROFILE, UPDATE_PROFILE } from '@/graphql'
import AvatarEditor from '@/components/AvatarEditor'

export default {
    data () {
        return {
            profile: {
                name: ''
            },
            form: {
                name: '',
                bio: '',
                avatar: ''
            },
            message: {
                position: 'left',
                duration: 3000,
                show: false
            }
        }
    },
    computed: {
        preparedForm () {
            const keys = ['name', 'bio', 'url', 'avatar']
            const { id } = this.profile
            const birthday = this.$refs.birthdayPicker.selectedDate.toJSON() || this.profile.birthday
            const results = {
                id,
                birthday
            }

            keys.forEach(key => {
                results[key] = this.form[key] || this.profile[key]
            })

            return results
        }
    },
    methods: {
        updateAvatar (avatarUrl) {
            this.form.avatar = avatarUrl
        },
        async updateProfile () {
            await this.$apollo.mutate({
                mutation: UPDATE_PROFILE,
                variables: {
                    profile: this.preparedForm
                },
                update (store, { data: { profile } }) {
                    const query = GET_PROFILE
                    const data = store.readQuery({ query })

                    store.writeQuery({
                        query,
                        data: {
                            ...data,
                            profile
                        }
                    })
                }
            })

            this.message.show = true
        },
        setFormValues (key, {target: { value }}) {
            this.form[key] = value
        },
        dateFilter (date) {
            const current = new Date(date).getTime()
            const today = new Date().getTime()

            return current > today
        }
    },
    components: {
        'avatar-editor': AvatarEditor
    },
    apollo: {
        profile: {
            query: GET_PROFILE
        }
    }
}
</script>
