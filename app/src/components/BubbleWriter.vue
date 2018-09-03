<template>
    <div>
        <form novalidate>
            <md-card class="writer">
                <md-card-content>
                    <md-field>
                        <label>内容</label>
                        <md-textarea v-model="form.text">

                        </md-textarea>
                    </md-field>
                </md-card-content>
                <md-card-actions md-alignment="left">
                    <md-button @click="choosePhotos" class="md-icon-button">
                        <md-icon>camera</md-icon>
                    </md-button>
                    <!-- <md-button class="md-icon-button">
                        <md-icon>link</md-icon>
                    </md-button> -->
                </md-card-actions>

                <md-card-content>
                    <div class="photo-box">
                        <md-content v-for="photo in form.photos" class="photo-box__photo">
                            <img :src="photo.src" alt="IMAGE">
                        </md-content>
                    </div>
                </md-card-content>

                <md-divider></md-divider>
                <md-card-actions>
                    <md-button @click="createBubble" type="submit" class="md-primary">CREATE BUBBLE</md-button>
                </md-card-actions>
            </md-card>
        </form>
    </div>
</template>

<script>
    import { UploaderBuilder } from 'qiniu4js'
    import { GET_BUBBLES_PAGE, CREATE_BUBBLE } from '@/graphql'

    export default {
        data () {
            return {
                form: {
                    text: '',
                    type: 'text',
                    photos: []
                }
            }
        },
        computed: {
            jsonField () {
                const { photos } = this.form
                const data = {
                    photos
                }

                return JSON.stringify(data)
            },
            bubbleInput () {
                const { type, text } = this.form

                return {
                    type,
                    text,
                    data: this.jsonField
                }
            }
        },
        methods: {
            getUploader () {
                const self = this
                const uploader = new UploaderBuilder()
                    .domain({
                        'https': 'https://upload-z2.qiniup.com',
                        'http': 'http://upload-z2.qiniup.com'
                    })
                    .compress(0.75)
                    .accept(['.png', 'jpg', 'jpeg', 'gif'])
                    .tokenFunc(async (setToken, task) => {
                        const res = await fetch(`http://localhost:3000/k/qiniu`, {
                            credentials: 'include'
                        })
                        const json = await res.json()
                        setToken(json.uptoken)
                    })
                    .listener({
                        onTaskProgress () {},
                        onTaskSuccess (task) {
                            const src = `https://static.feddy.org/${task.result.key}`
                            if (self.form.photos.length === 0) {
                                self.form.type = 'photo'
                            }
                            self.form.photos.push({
                                src
                            })
                        },
                        onTaskFail () {}
                    })
                    .build()

                return uploader
            },

            choosePhotos () {
                const uploader = this.getUploader()
                uploader.chooseFile()
            },
            clearForm () {
                this.form.text = ''
            },
            async createBubble () {
                await this.$apollo.mutate({
                    mutation: CREATE_BUBBLE,
                    variables: {
                        bubble: this.bubbleInput
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

<style>
.writer {
    min-width: 640px;
}

</style>
