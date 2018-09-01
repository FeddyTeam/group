<template>
    <div class="md-layout">
        <div class="md-layout-item">
            <bubble-card v-for="bubble in bubblesPage.bubbles" :bubble="bubble"></bubble-card>

            <md-card>
                <md-card-content>
                    <md-button @click="loadMore">LOAD MORE</md-button>
                </md-card-content>
            </md-card>
        </div>

        <div class="md-layout-item"></div>

        <md-button @click="openDialog" class="md-fab md-fab-bottom-right md-fixed">
            <md-icon>add</md-icon>
        </md-button>

        <md-dialog :md-active.sync="u.dialogVisible">
            <md-dialog-title>CREATE BUBBLE</md-dialog-title>
            <bubble-maker></bubble-maker>
        </md-dialog>
    </div>
</template>

<script>
import { GET_BUBBLES_PAGE } from '@/graphql'
import BubbleMaker from '@/components/BubbleMaker'
import BubbleCard from '@/components/BubbleCard'

export default {
    data () {
        return {
            u: {
                dialogVisible: false,
                count: 12,
                skip: 0
            },
            bubblesPage: {
                bubbles: [],
                hasMore: true
            }
        }
    },
    methods: {
        openDialog () {
            this.u.dialogVisible = true
        },
        loadMore () {
            if (!this.bubblesPage.hasMore) {
                return
            }

            this.u.skip += this.u.count
            const { skip, count } = this.u
            this.$apollo.queries.bubblesPage.fetchMore({
                variables: { skip, count },
                updateQuery (previousResult, { fetchMoreResult }) {
                    const newItems = fetchMoreResult.bubblesPage.bubbles
                    const hasMore = fetchMoreResult.bubblesPage.hasMore

                    return {
                        bubblesPage: {
                            __typename: previousResult.bubblesPage.__typename,
                            bubbles: [...previousResult.bubblesPage.bubbles, ...newItems],
                            hasMore
                        }
                    }
                }
            })
        }
    },
    components: {
        'bubble-maker': BubbleMaker,
        'bubble-card': BubbleCard
    },
    apollo: {
        bubblesPage: {
            query: GET_BUBBLES_PAGE,
            variables: {}
        }
    }
}
</script>

<style>
    .bubble-card {
        margin: 10px;
    }
</style>
