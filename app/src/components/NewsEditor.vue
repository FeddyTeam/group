<template>
    <md-content>
        <md-snackbar :md-active.sync="u.messageVisiblity">
            <span>{{u.messageContent}}</span>
        </md-snackbar>

        <div class="md-layout md-gutter">
            <section class="md-layout-item">
                <div class="md-content">
                    <h2 class="md-display-">Preview: </h2>
                    <md-divider></md-divider>

                    <div class="md-layout md-gutter">
                        <div class="md-layout-item">
                            <figure v-show="form.image">
                                <img :src="form.image">
                                <figcaption>IMAGE</figcaption>
                            </figure>
                        </div>
                    </div>
                    <div class="md-layout">
                        <div class="md-layout-item">
                            <figure v-show="form.altImage">
                                <img :src="form.altImage">
                                <figcaption>ALT IMAGE</figcaption>
                            </figure>
                        </div>
                        <div class="md-layout-item">
                            <figure v-show="form.thumbnail">
                                <img :src="form.thumbnail">
                                <figcaption>THUMBNAIL</figcaption>
                            </figure>
                        </div>
                    </div>

                </div>
            </section>
            <section class="md-layout-item">
                <md-card>
                    <md-card-header>NEWS EDITOR / {{editingMode ? 'EDIT' : 'CREATE'}} NEWS {{newsId}}</md-card-header>
                    <md-divider></md-divider>
                    <md-card-content>
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item">
                                <md-field>
                                    <label for="news_type">TYPE</label>
                                    <md-select v-model="form.type" id="news_type">
                                        <md-option v-for="item in NewsType" :value="item">{{item}}</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                            <div class="md-layout-item">
                                <md-field>
                                    <label for="news_level">LEVEL</label>
                                    <md-select v-model="form.level" id="news_level">
                                        <md-option v-for="item in NewsLevel" :value="item">{{item}}</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                            <div class="md-layout-item">
                                <md-field>
                                    <label for="news_status">STATUS</label>
                                    <md-select v-model="form.status" id="news_status">
                                        <md-option v-for="item in NewsStatus" :value="item">{{item}}</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                        </div>

                        <md-field>
                            <label>TITLE</label>
                            <md-input v-model="form.title"></md-input>
                        </md-field>

                        <md-field>
                            <label>ALT TITLE</label>
                            <md-input v-model="form.altTitle"></md-input>
                        </md-field>

                        <md-field>
                            <label>CONTENT / DESCRIPTION</label>
                            <md-textarea v-model="form.content" md-autogrow md-counter="120"></md-textarea>
                        </md-field>

                        <md-field>
                            <md-icon>link</md-icon>
                            <md-input v-model="form.link"></md-input>
                        </md-field>

                        <md-field>
                            <label>IMAGE</label>
                            <md-input v-model="form.image"></md-input>
                            <md-button v-show="form.image" class="md-icon-button" title="强制设置" @click="forceSetImage">
                                <md-icon>done_all</md-icon>
                            </md-button>
                            <image-picker-button @change="setImage" v-model="form.image" icon="add_photo_alternate" />
                        </md-field>

                        <md-field>
                            <label>ALT IMAGE</label>
                            <md-input v-model="form.altImage"></md-input>
                            <image-picker-button v-model="form.altImage" disabled />
                        </md-field>

                        <md-field>
                            <label>THUMBNAIL</label>
                            <md-input v-model="form.thumbnail"></md-input>
                            <image-picker-button v-model="form.thumbnail" disabled />
                        </md-field>

                        <div class="md-layout md-gutter">
                            <div class="md-layout-item">
                                <md-field>
                                    <md-icon>color_lens</md-icon>
                                    <md-input v-model="form.color" type="color"></md-input>
                                </md-field>
                            </div>
                            <div class="md-layout-item">
                                <md-field>
                                    <label for="news_status">activedAt</label>
                                    <md-input v-model="form.activedAt" disabled></md-input>
                                    <md-icon>timer</md-icon>
                                </md-field>
                            </div>
                            <div class="md-layout-item">
                                <md-field>
                                    <label for="news_status">expiredAt</label>
                                    <md-input v-model="form.expiredAt" disabled></md-input>
                                    <md-icon>timer_off</md-icon>
                                </md-field>
                            </div>
                        </div>
                    </md-card-content>
                    <md-divider></md-divider>
                    <md-card-actions>
                        <md-button @click="saveNews" class="md-primary">SAVE</md-button>
                        <md-button @click="clearForm" disabled>RESET</md-button>
                    </md-card-actions>
                </md-card>
            </section>
        </div>
    </md-content>
</template>

<script>
import { CREATE_NEWS, UPDATE_NEWS } from '@/graphql'
import ImagePickerButton from '@/components/ImagePickerButton'

export default {
    props: ['mode'],
    data () {
        return {
            u: {
                id: null,
                editing: false,

                messageContent: '',
                messageVisiblity: false
            },
            form: {
                title: '测试一条新闻',
                altTitle: '这条新闻的副标题',
                content: '',
                link: 'https://note.zerook.net',
                image: 'https://static.feddy.org/FtnqM8NupRtfw_2-BUArl_nl_GiV',
                altImage: '',
                thumbnail: '',
                color: '#FFFFFF',
                expiredAt: '',
                activedAt: '',

                type: 'news',
                level: 'normal',
                status: 'draft'
            }
        }
    },
    computed: {
        newsId () {
            return this.u.id || this.$route.params.newsId
        },
        editingMode () {
            const isEditing = this.mode === 'editing' || this.u.editing
            return isEditing && this.newsId
        },
        mutationType () {
            return this.editingMode ? UPDATE_NEWS : CREATE_NEWS
        },
        newsInput () {
            const id = this.newsId
            const { activedAt, expiredAt } = this.form
            const data = {
                ...this.editingMode && { id },
                ...this.form,
                userId: 'fake-user-id',
                activedAt: activedAt || null,
                expiredAt: expiredAt || null
            }

            return data
        },
        altImageTag: () => '?imageView/0/w/640',
        thumbnailTag: () => '?imageView/1/w/256',
        NewsType: () => ['news', 'project', 'event', 'post', 'notice', 'alert', 'story', 'link', 'ad', 'special'],
        NewsLevel: () => ['removed', 'normal', 'featured', 'mustread'],
        NewsStatus: () => ['draft', 'pending', 'actived', 'expired', 'deleted']
    },
    methods: {
        showMessage (message) {
            this.u.messageContent = message
            this.u.messageVisiblity = true
        },
        toggleToEditing ({ id }) {
            this.u.id = id
            this.u.editing = true
            this.$router.replace(`/cms/news/editor/${id}`)
        },
        forceSetImage () {
            this.setImage(this.form.image, true)
        },
        setImage (baseUrl, yes = false) {
            const altImage = `${baseUrl}${this.altImageTag}`
            const thumbnail = `${baseUrl}${this.thumbnailTag}`
            this.form.altImage = (yes && this.altImage) || altImage
            this.form.thumbnail = (yes && this.thumbnail) || thumbnail
        },
        clearForm () {

        },
        async saveNews () {
            const results = await this.$apollo.mutate({
                mutation: this.mutationType,
                variables: {
                    news: this.newsInput
                }
            })

            const { createdNews, updatedNews } = results.data
            if (createdNews) {
                this.toggleToEditing(createdNews)
                this.showMessage('SUCCESSFULLY CREATED')
            } else if (updatedNews) {
                this.showMessage('SUCCESSFULLY UPDATED')
            } else {
                this.showMessage('SOMTHING WRONG')
            }
        }
    },
    components: {
        'image-picker-button': ImagePickerButton
    }
}
</script>

<style>
    [disabled],
    :disabled {
        color: #ddd !important;
        -webkit-text-fill-color: #ddd !important;
    }
</style>

