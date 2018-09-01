<template>
    <md-card class="bubble-card">
        <md-card-header>
            <md-avatar>
                <img :src="bubble.user.avatar" alt="Avatar">
            </md-avatar>

            <div class="md-title">{{bubble.user.name}} @{{bubble.user.username}}</div>
            <div class="md-subhead">{{new Date(bubble.createdAt).toLocaleDateString()}}</div>
        </md-card-header>

        <md-card-media md-ratio="16:9" v-show="bubble.cover">
            <img :src="bubble.cover" alt="Cover">
        </md-card-media>

        <md-card-content>
            {{bubble.text}}
        </md-card-content>

        <md-card-actions>
            <md-button v-if="u.commentsVisible" @click="hideComments">HIDE COMMENTS</md-button>
            <md-button v-else @click="loadComments">LOAD COMMENTS</md-button>
        </md-card-actions>

        <md-card-content v-show="u.commentsVisible">
            <md-field>
                <md-icon>add_comment</md-icon>
                <md-input v-on:keyup.enter="createComment" v-model="form.content"></md-input>
                <md-icon>subdirectory_arrow_left</md-icon>
            </md-field>

            <p v-for="comment in comments">
                <small>
                    <span>{{new Date(comment.createdAt).toLocaleString()}}</span>
                    <strong>{{comment.user.name}}: </strong>
                </small>
                <span>{{comment.content}}</span>
            </p>
        </md-card-content>
    </md-card>
</template>

<script>
    import { CREATE_COMMENT, GET_COMMENTS } from '@/graphql'

    export default {
        props: ['bubble'],
        data () {
            return {
                form: {
                    content: ''
                },
                u: {
                    commentsVisible: false
                },
                comments: []
            }
        },
        methods: {
            async createComment () {
                const bubbleId = this.bubble.id

                await this.$apollo.mutate({
                    mutation: CREATE_COMMENT,
                    variables: {
                        comment: {
                            content: this.form.content,
                            bubbleId
                        }
                    },
                    update (store, { data: { newComment } }) {
                        const query = GET_COMMENTS
                        const variables = { bubbleId }

                        const data = store.readQuery({ query, variables })
                        data.comments.unshift(newComment)
                        store.writeQuery({ query, variables, data })
                    }
                })

                this.clearForm()
            },
            clearForm () {
                this.form.content = ''
            },
            loadComments () {
                /*
                    Plan A: set flag ==> load component commentList ==> apollo work
                    > Plan B: set flag ==> call query ==> apollo work
                */
                const bubbleId = this.bubble.id

                this.u.commentsVisible = true
                this.$apollo.queries.comments.setVariables({ bubbleId })
                this.$apollo.queries.comments.refresh()
            },
            hideComments () {
                this.u.commentsVisible = false
            }
        },
        apollo: {
            comments: {
                query: GET_COMMENTS,
                variables: {
                    bubbleId: null
                },
                skip () {
                    return !this.u.commentsVisible
                }
            }
        }
    }
</script>

<style scoped>
.bubble-card {
    margin: 12px;
}
</style>

