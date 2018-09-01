<template>
    <div class="md-card">
        <div class="md-card-header">UPLAOD IMAGE</div>
        <div class="md-card-content">
            <md-field :md-change="prepareImage">
                <label>UPLOAD AN IMAGE</label>
                <md-file @md-change="prepareImage" v-model="url" accept="image/*" />
            </md-field>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                url: ''
            }
        },
        // props: ['url'],
        methods: {
            prepareImage (fileList) {
                console.warn(fileList)
                this.doUpload(fileList)
            },
            async doUpload (fileList) {
                const formData = new FormData()
                formData.append('image', fileList[0])

                try {
                    const response = await fetch('http://localhost:3000/upload', {
                        method: 'PUT',
                        credentials: 'include',
                        body: formData
                    })

                    const json = await response.json()

                    console.log('%cSuccess', 'color: green; font-size: 3em;')
                    console.log(json)
                } catch (e) {
                    console.error('error', e)
                }
            }
        }
    }
</script>
