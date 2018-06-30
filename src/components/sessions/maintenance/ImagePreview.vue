<template>
    <modal
        :title="title"
        :show="show"
        :large="true"
        :footer="false"
        width="100%"
        height="100%"
        @close="$emit('close')">

        <div class="row">
            <div class="col-lg-12"
                width="100%"
                v-if="!loadingImage">
                <div class="thumbnail" >
                    <img class="img-responsive" 
                        width="100%"
                        :height="minHeight"                    
                        v-bind:src="base64Data">
                </div>
            </div>            
        </div>

        <loading
            v-if="loadingImage"></loading>

    </modal>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Loading from '@/components/shared/Loading'
    import Modal from '@/components/shared/Modal'

    export default {
        components: {
            Modal,
            Loading
        },

        props: {
            base64: {
                type: String
            },

            show: {
                type: Boolean,
                default: false
            },

            title: {
                type: String
            },

            mimeType: {
                type: String,
                default: 'image'
            }
        },

        computed: {
            ...mapGetters([
                'pageContentSize',
                'isLoading'
            ]),

            base64Data () {
                return 'data:' + this.mimeType + ';base64,' + (this.base64 ? this.base64 : '')
            },

            loadingImage () {
                return this.base64 == null
            },

            minHeight () {
                return (this.pageContentSize.height * 0.7) + 'px'
            }
        }
    }
</script>
