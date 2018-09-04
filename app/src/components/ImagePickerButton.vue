<template>
    <md-button @click="choosePhoto" class="md-icon-button" :disabled="disabled">
        <md-icon>{{icon||'photo'}}</md-icon>
    </md-button>
</template>

<script>
    import { UploaderBuilder } from 'qiniu4js'

    export default {
        props: ['value', 'icon', 'disabled'],
        data () {
            return {
                hash: '',
                key: ''
            }
        },
        computed: {
            url () {
                const ns = 'https://static.feddy.org'
                return `${ns}/${this.key}`
            }
        },
        methods: {
            choosePhoto () {
                const uploader = this.getUploader()
                uploader.chooseFile()
            },
            sendChangeEvent (value) {
                this.$emit('change', value)
            },
            sendInputEvent (value) {
                this.$emit('input', value)
            },
            getUploader () {
                const self = this
                const authorization = this.$jwt.authorization
                const headers = new Headers()
                headers.append('Authorization', authorization)
                const uploader = new UploaderBuilder()
                    .domain(self.g.qiniu.domains)
                    .multiple(false)
                    .accept(['.png', '.jpg', '.jpeg', '.gif'])
                    .tokenFunc(async (setToken, task) => {
                        const res = await fetch(self.g.qiniu.tokenUrl, {
                            headers,
                            credentials: 'include'
                        })
                        const json = await res.json()
                        setToken(json.uptoken)
                    })
                    .listener({
                        onTaskProgress (task) {},
                        onTaskSuccess (task) {
                            self.key = task.result.key
                            self.sendInputEvent(self.url)
                            self.sendChangeEvent(self.url)
                        },
                        onTaskFail () {}
                    })
                    .build()
                return uploader
            }
        }
    }
</script>
