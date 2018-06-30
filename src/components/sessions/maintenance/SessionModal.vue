<template>
    <modal
        :footer="true"
        title="Escolher imagens"
        :show="active"
        :closeWhenOk="true"
        :okText="'Guardar'"
        :cancelText="'Descartar'"
        :okClass="okClass"
        :cancelClass="cancelClass"
        :okButtonDisabled="!isFormValid"
        @ok="$emit('ok', $event)"
        @close="$emit('close', $event); close()">

        <div class="row">
            <div class="col-lg-12">

                <form class="form-horizontal">
                    <div class="form-group"><label class="col-sm-2 control-label">Documento</label>
                        <div class="col-sm-10">
                            <multiselect
                                v-model="filter.checklistItemId"
                                :options="checklistItems"
                                :show-labels="false"
                                :searchable="true"
                                :close-on-select="true"
                                :no-results-label="$i18n.t('general.no-results')"
                                track-by="id"
                                label="description"
                                @input="applyFilter"
                                :loading="isLoadingChecklistItems">
                            </multiselect>
                        </div>
                    </div>

                    <div class="hr-line-dashed"></div>

                    <div v-if="!hasImages"
                         class="thumbnail">
                            <img class="img-responsive" src="/static/assets/default-thumbnail.jpg" alt="">
                    </div>

                    <table
                           v-if="hasImages">
                        <tr
                            v-for="item in images"
                            v-bind:key="item.id">
                            <td>
                                <div class="thumbnail">
                                    <img :src="'data:image/jpg;base64,' + item.content" width="640" height="480">
                                </div>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </modal>
</template>

<script>
    import _ from 'lodash'
    import requestService from '@/services/shared/request.service'
    import checklistService from '@/services/checklists/checklist.service'
    import documentsService from '@/services/documents/document.service'
    import tooltip from '@/directives/tooltip'
    import PageHeader from '@/components/layout/PageHeader'
    import Loading from '@/components/shared/Loading'
    import Multiselect from '@/components/shared/multi-select'
    import Modal from '@/components/shared/Modal'
    import siganlR from '@/services/signalr/signalr.service'
    import {mapGetters, mapActions} from 'vuex'
    import store from '@/vuex/store'

    let loadingKeys = {
        fetchingImages: 'fetching-images',
        fetchingSessionTypes: 'fetching-session-types'
    }

    export default {
        directives: {
            tooltip
        },

        components: {
            PageHeader,
            Loading,
            Multiselect,
            Modal
        },

        props: {
            // Pass any given initial filter properties that need to be pre-selected
            /* Filter properties:
                showModal: true,
                checklistId: '',
            */
            showModal: {
                type: Boolean,
                required: false
            },

            checklistItems: {
                type: Array,
                required: true
            },
        },

        data () {
            return {
                okClass: 'btn btn-success',
                cancelClass: 'btn btn-primary',
                images: [],

                active: false,

                binaryHub: siganlR.hubs.binary,

                filter: {
                    checklistItemId: null
                },
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'getLastImageReceived'
            ]),

            isLoadingImages () {
                return this.images.length === 0
            },

            isLoadingChecklistItems () {
                return !!_.intersection(this.loadings, [loadingKeys.fetchingSessionTypes]).length
            },

            hasImages () {
                return !!(this.images && this.images.length > 0)
            },

            isFormValid () {
                return (this.hasImages && this.filter.checklistItemId !== null)
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove',
                'setLastImageReceived'
            ]),

            bindBinaryHubEvents () {
                let self = this
                this.binaryHub.connection.on('ReceiveImage', data => {

                    self.images = []
                    let image = {
                        guid: data.guid,
                        checklistItemId: self.filter.checklistItemId,
                        content: data.imageBinary }

                    self.open()

                    self.images.push(image)
                    self.setLastImageReceived(image)
                })
            },

            open () {
                console.log('open')
                this.active = true
                this.filter.checklistItemId = null
            },

            close () {
                console.log('close')
                this.active = false
            },

            applyFilter (raw) {
                console.log('applyFilter', raw)

                let storedImage = this.getLastImageReceived

                let updatedImage = {
                    id: storedImage.guid,
                    content: storedImage.content,
                    checklistItemId: this.filter.checklistItemId ? this.filter.checklistItemId.id : null
                }
                // update stored image with selected checklist
                this.setLastImageReceived(updatedImage)
            },
        },

        created () {
            this.bindBinaryHubEvents()
        },

        beforeDestroy () {

        }
    }

</script>

<style>
    .cancelClass {
        color: 'btn btn-danger';
        background: #C72924!important;
    }
</style>
