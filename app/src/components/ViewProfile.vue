<template>
    <div class="md-layout">
        <div class="md-layout-item">
            <md-card>
                <md-card-header>
                    YOUR PROFILE
                </md-card-header>
                <md-divider></md-divider>
                <md-card-content>
                    <md-list class="md-double-line">
                        <md-list-item>
                            <md-avatar>
                                <img :src="profile.avatar" alt="Avatar">
                            </md-avatar>

                            <span class="md-list-item-text">
                                {{profile.username}}
                            </span>

                            <!-- <md-button class="md-icon-button md-list-action">
                                <md-icon>edit</md-icon>
                            </md-button> -->
                        </md-list-item>

                        <md-divider></md-divider>

                        <md-list-item v-for="attr in attrs">
                            <md-icon class="md-primary">{{attr.icon}}</md-icon>
                            <div class="md-list-item-text">
                                <span>{{profile[attr.name] || '-'}}</span>
                                <span>{{attr.label}}</span>
                            </div>
                        </md-list-item>
                    </md-list>
                </md-card-content>
                <md-divider></md-divider>
                <md-card-actions>
                    <router-link tag="md-button" to="/profile/password">UPDATE YOUR PASSWORD</router-link>
                    <router-link tag="md-button" to="/profile/edit">EDIT YOUR PROFILE</router-link>
                </md-card-actions>
            </md-card>
        </div>

        <div class="md-layout-item">
        </div>
    </div>
</template>

<script>
import { GET_PROFILE } from '@/graphql'
import ProfileEditor from '@/components/ProfileEditor'

export default {
    data () {
        return {
            attrs: [
                { name: 'email', icon: 'email', label: 'Email' },
                { name: 'name', icon: 'account_box', label: 'Name' },
                { name: 'bio', icon: 'chat', label: 'Bio' },
                { name: 'birthday', icon: 'calendar_today', label: 'Birthday' },
                { name: 'url', icon: 'web', label: 'Website' }
            ],
            profile: {}
        }
    },
    components: {
        'profile-editor': ProfileEditor
    },
    apollo: {
        profile: {
            query: GET_PROFILE
        }
    }
}
</script>

<style>

</style>
