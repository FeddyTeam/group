<template>
    <div>
        <md-table v-model="pagedList.news" @md-selected="onSelect" md-card>
            <md-table-toolbar>
                <h1 class="md-title">{{type}} Manager</h1>
            </md-table-toolbar>

            <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
                <div class="md-toolbar-section-start">You selected {{count}} item(s), and? / In fact, {{selectedIds.length}} item(s)</div>

                <div class="md-toolbar-section-end">
                    <md-button @click="preDeleteNews" class="md-icon-button">
                        <md-icon>delete</md-icon>
                    </md-button>
                </div>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="multiple" md-auto-select>
                <md-table-cell md-label="THUMBNAIL">
                    <img :src="item.thumbnail" width="64" height="64">
                </md-table-cell>
                <md-table-cell md-label="TITLE">{{ item.title }}</md-table-cell>
                <md-table-cell md-label="ALT TITLE">{{ item.altTitle }}</md-table-cell>
                <md-table-cell md-label="STATUS">{{ item.status }}</md-table-cell>
                <md-table-cell md-label="LEVEL">{{ item.level }}</md-table-cell>
                <md-table-cell md-label="BY">{{ item.user.name }}</md-table-cell>
                <md-table-cell md-label="TIME CREATED">{{ item.createdAt }}</md-table-cell>
                <md-table-cell md-label="ACTIONS">
                    <router-link :to="`/cms/news/editor/${item.id}`" tag="md-button" class="md-primary md-icon-button">
                        <md-icon>edit</md-icon>
                    </router-link>
                    <md-button class="md-primary md-icon-button" disabled>
                        <md-icon>visibility</md-icon>
                    </md-button>
                    <md-button class="md-accent md-icon-button" @click="deleteNews([item.id])" disabled>
                        <md-icon>delete</md-icon>
                    </md-button>
                </md-table-cell>
            </md-table-row>
        </md-table>

        <md-dialog-confirm
            :md-active.sync="u.confirmVisiblity"
            :md-title="u.confirmTitle"
            :md-content="u.confirmContent"
            md-confirm-text="YES"
            md-cancel-text="CANCEL"
            @md-cancel="onCancel"
            @md-confirm="deleteNews" />

        <md-snackbar :md-active.sync="u.messageVisiblity">
            <span>{{u.messageContent}}</span>
        </md-snackbar>
    </div>
</template>

<script>
    import { FETCH_NEWS, PERMANENTLY_DELETE_NEWS } from '@/graphql'

    export default {
        props: ['type'],
        data () {
            return {
                u: {
                    selectedItems: [],
                    confirmVisiblity: false,
                    confirmContent: '',

                    messageVisiblity: false,
                    messageContent: ''
                },
                pagedList: {
                    news: [],
                    hasMore: true,
                    error: false,
                    message: ''
                }
            }
        },
        computed: {
            selectedIds () {
                return this.u.selectedItems.map(one => one.id)
            }
        },
        methods: {
            showMessage (message) {
                this.u.messageContent = message
                this.u.messageVisiblity = true
            },
            onCancel () {

            },
            confirm (message, title = 'Confirm?') {
                this.u.confirmTitle = title
                this.u.confirmContent = message
                this.u.confirmVisiblity = true
            },
            preDeleteNews () {
                const count = this.selectedIds.length

                this.confirm(`Delete the ${count} item(s)?`, 'Please confirm')
            },
            onSelect (items) {
                // TODO vue-material md-table fix
                this.u.selectedItems = items
            },
            async deleteNews (ids) {
                const results = await this.$apollo.mutate({
                    mutation: PERMANENTLY_DELETE_NEWS,
                    variables: {
                        ids: ids || this.selectedIds
                    }
                })

                const { error, data: { count } } = results
                if (!error) {
                    this.showMessage(`SUCCESSFULLY DELETED ${count} ITEM(S)`)
                    this.$apollo.queries.pagedList.refetch()
                } else {
                    this.showMessage('SONTHING ERROR')
                }
            },
            loadMoreNews () {
                this.u.skip += this.u.count
                const { skip, count } = this.u
                this.$apollo.queries.pagedList.fetchMore({
                    variables: { skip, count },
                    updateQuery (previousResult, { fetchMoreResult }) {
                        const newItems = fetchMoreResult.pagedList.news
                        const hasMore = fetchMoreResult.pagedList.hasMore

                        return {
                            pagedList: {
                                __typename: previousResult.pagedList.__typename,
                                news: [...previousResult.pagedList.news, ...newItems],
                                hasMore
                            }
                        }
                    }
                })
            }
        },
        apollo: {
            pagedList: {
                query: FETCH_NEWS,
                variables () {
                    const type = this.type

                    return { type }
                }
            }
        }
    }
</script>
