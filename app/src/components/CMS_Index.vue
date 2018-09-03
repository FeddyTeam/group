<template>
    <md-card>
        <md-card-header>
            CMS: Index
        </md-card-header>
        <md-divider></md-divider>
        <md-card-content>
            <h2 class="md-display-2">
                Welcome: {{profile.name}}
            </h2>
            <md-divider></md-divider>
            <p>╮(╯∀╰)╭</p>
        </md-card-content>
    </md-card>
</template>

<script>
import { GET_PROFILE } from '@/graphql'

export default {
    data () {
        return {
            profile: {}
        }
    },
    apollo: {
        profile: {
            query: GET_PROFILE
        }
    }
}
</script>
