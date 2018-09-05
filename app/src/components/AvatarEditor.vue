<template>
    <md-content @click="doUpload">
        <md-avatar class="md-large">
            <img :src="imgSrc" alt="Avatar"/>
        </md-avatar>
    </md-content>
</template>

<script>
    import { UploaderBuilder } from 'qiniu4js'

    export default {
        data () {
            return {
                u: {
                    url: '',
                    ns: 'https://static.feddy.org'
                }
            }
        },
        computed: {
            imgSrc () {
                return this.u.url || this.url
            }
        },
        props: ['url', 'set-url'],
        methods: {
            getUploader () {
                const self = this
                const authorization = this.$jwt.authorization
                const headers = new Headers()
                headers.append('Authorization', authorization)
                const uploader = new UploaderBuilder()
                    .domain({
                        'https': 'https://upload-z2.qiniup.com',
                        'http': 'http://upload-z2.qiniup.com'
                    })
                    .multiple(false)
                    .accept(['.png', '.jpg', '.jpeg', '.gif'])
                    .tokenFunc(async (setToken, task) => {
                        const res = await fetch('http://localhost:3000/k/qiniu', {
                            headers,
                            credentials: 'include'
                        })
                        const json = await res.json()
                        setToken(json.uptoken)
                    })
                    .listener({
                        onTaskProgress (task) {},
                        onTaskSuccess (task) {
                            self.u.url = `${self.u.ns}/${task.result.key}`
                            self.setUrl(self.u.url)
                        },
                        onTaskFail () {}
                    })
                    .build()
                return uploader
            },
            doUpload (fileList) {
                const uploader = this.getUploader()

                uploader.chooseFile()
            }
        }
    }
</script>
