<template>
    <div>
        <md-table v-model="users">
            <md-table-toolbar>
                <h1 class="md-title">User Manager</h1>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="THUMBNAIL">
                    <img :src="item.avatar" width="64" height="64">
                </md-table-cell>
                <md-table-cell md-label="USERNAME">{{ item.username }}</md-table-cell>
                <md-table-cell md-label="E-MAIL">{{ item.email }}</md-table-cell>
                <md-table-cell md-label="NAME">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="STATUS">{{ item.status }}</md-table-cell>
                <md-table-cell md-label="TIME CREATED">{{ item.createdAt }}</md-table-cell>
                <md-table-cell md-label="SETTINGS">
                    <router-link class="md-icon-button" tag="md-button" :to="`/manage/users/${item.id}`" disabled>
                        <md-icon>settings</md-icon>
                    </router-link>
                </md-table-cell>
            </md-table-row>
        </md-table>
    </div>
</template>

<script>
    import { FETCH_USERS } from '@/graphql'

    export default {
        data () {
            return {
                users: []
            }
        },
        methods: {

        },
        apollo: {
            users: {
                query: FETCH_USERS
            }
        }
    }
</script>

<style>
    .card-box {
        display: flex;
        flex-wrap: wrap;
    }

    .card-box__card {
        flex: 1;
        max-width: 300px;
        min-width: 240px;
        /* height: 160px; */
        margin: 10px;
        /* border: 1px solid #ddd; */
    }
</style>

