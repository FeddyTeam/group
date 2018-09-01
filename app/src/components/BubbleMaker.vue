<template>
    <div>
        <form novalidate>
            <md-card md-theme="primary">
                <md-card-content>
                    <markdown-editor v-model="form.text"></markdown-editor>
                </md-card-content>
                <md-card-actions>
                    <md-button @click="createBubble" type="submit" class="md-primary">CREATE BUBBLE</md-button>
                </md-card-actions>
            </md-card>
        </form>
    </div>
</template>

<script>
    import { GET_BUBBLES_PAGE, CREATE_BUBBLE } from '@/graphql'

    export default {
        data () {
            return {
                form: {
                    text: ''
                }
            }
        },
        methods: {
            clearForm () {
                this.form.text = ''
            },
            async createBubble () {
                await this.$apollo.mutate({
                    mutation: CREATE_BUBBLE,
                    variables: {
                        bubble: {
                            text: this.form.text
                        }
                    },
                    update (store, { data: { newBubble } }) {
                        const query = GET_BUBBLES_PAGE
                        const data = store.readQuery({ query })

                        data.bubblesPage.bubbles.unshift(newBubble)
                        store.writeQuery({ query, data })
                    }
                })

                this.clearForm()
            }
        }
    }
</script>
