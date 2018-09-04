<template>
    <div>
        <h2 class="md-display-2">
            Welcome: {{profile.name}}
        </h2>
        <p>╮(╯∀╰)╭</p>
    </div>
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
