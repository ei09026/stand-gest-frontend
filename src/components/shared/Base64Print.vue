<template>
    <modal
        :title="title"
        :show="show"
        :large="true"
        :footer="false"
        @close="$emit('close')">

        <object id="pdf_content"
            v-if="!loadingReport"
            width="100%"
            :height="minHeight"
            :type="mimeType"
            :data="base64Data">
            <p>Error loading PDF</p>
        </object>
    
        <loading
            v-if="loadingReport"></loading>
    
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
                default: 'application/pdf'
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

            loadingReport () {
                return this.base64 == null
            },

            minHeight () {
                return (this.pageContentSize.height * 0.7) + 'px'
            }
        }
    }
</script>
