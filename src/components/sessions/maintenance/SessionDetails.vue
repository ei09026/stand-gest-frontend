<template>
    <div class="row session-details" id="linhaform">
        <session-modal
            :showModal="sessionModalVisible"
            :results="[]"
            :checklistItems="checklistItems"
            @ok="saveDocument"
            @close="emitImageValidated"></session-modal>

        <!-- Coluna esquerda de margem -->
        <div class="col-md-2"></div>

        <!-- Coluna central para conteudo -->
        <div class="col-md-8 form-moza">
            <div class="row m-b-lg">
                <div class="col-md-5 flex">
                    <div>
                        <img src="/static/assets/moza-icon.png" class="img-fluid moza-icon">
                    </div>

                    <input type="text" name="client-reference" class="form-control client-reference m-l-lg"
                        autocomplete="off"
                        autocorrect="off"
                        autocapitalize="off"
                        spellcheck="false"
                        v-model="sessionDetail.clientReference"
                        :disabled="isSessionReadOnly">
                </div>

                <div class="col-md-1 hidden-xs"></div>

                <div class="col-md-6 customer">
                    <check-item
                        v-model="sessionDetail.newClient"
                        :disabled="isSessionReadOnly">

                        Novo cliente
                    </check-item>
                </div>
            </div>

            <div class="row m-b-lg">
                <div class="col-md-5 flex">
                    <img src="/static/assets/moza-icon.png" class="img-fluid moza-icon">

                    <p class="reason m-l-lg">Motivo</p>
                </div>

                <div class="col-md-1 hidden-xs"></div>

                <div class="col-md-6">
                    <multiselect
                        v-model="filter.sessionType"
                        :disabled="isSessionReadOnly"
                        :options="sessionTypes"
                        :searchable="true"
                        :close-on-select="true"
                        :no-results-label="$i18n.t('general.no-results')"
                        track-by="id"
                        label="description"></multiselect>
                </div>
            </div>

            <loading
                v-show="isLoadingChecklistItems"></loading>

            <div class="row checklist-items m-b-lg"
                v-if="!isLoadingChecklistItems && checklistItems.length">

                <div class="col-xs-12"
                    v-for="item in checklistItems"
                    :key="item.id">

                    <check-item
                        :value="item.done"
                        :disabled="isSessionReadOnly || item.readonly"
                        @input="updateChecklistItem(item, $event)">

                        {{ item.description }}
                    </check-item>
                </div>
            </div>

            <loading
                v-show="isLoadingSessionDocuments"></loading>

            <div class="row"
                v-if="!isLoadingSessionDocuments && sessionDetail">

                <div class="col-xs-4 col-md-2 col-lg-1 p-w-xs m-b-lg"
                    v-for="item in sessionDetail.documents"
                    :key="item.id">

                    <div class="thumbnail m-b-sm">
                        <img class="img-responsive custom-thumbnail" ref="imageArea"
                            :src="displayImage(item.id)"
                            v-tooltip="{title: checklistItemDescription(item.checklistItemId)}"
                            @click="previewImage(item)">
                    </div>

                    <div class="row">
                        <div class="col-md-6 no-padding text-center">
                            <button type="button" class="btn btn-circle btn-danger"
                                :disabled="isSessionReadOnly"
                                @click="deleteSessionDocument(item.id)">

                                <i class="fa fa-times"></i>
                            </button>
                        </div>

                        <div class="col-md-6 no-padding text-center">
                            <button type="button" class="btn btn-circle btn-info"
                                @click="exportImage(item, 'imageArea')">

                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="m-b-lg">
                <textarea class="form-control round-corner" rows="3"
                    v-model="sessionDetail.observations"
                    :disabled="isSessionReadOnly"></textarea>
            </div>

            <div class="send-document"
                v-if="!isSessionReadOnly">

                <input type="file" class="hidden-input"
                    ref="uploadDocument"
                    :disabled="!canSendDocument"
                    @change="sendDocument" />

                <button type="button" class="btn btn-block round-corner"
                    :class="sendButtonClass"
                    :disabled="!canSendDocument"
                    v-text="emitDocumentLabel"
                    @click="uploadDocumentClicked"></button>
            </div>
        </div>

        <image-preview
            :base64="report.base64"
            :mimeType="'image'"
            :title="report.title"
            :show="report.visible"
            @close="report.visible = false"></image-preview>
    </div>
</template>

<script>
    import _ from 'lodash'
    import authService from '@/services/shared/auth.service'
    import dateTimeService from '@/services/shared/dateTime.service'
    import fileSaver from 'file-saver'
    import siganlR from '@/services/signalr/signalr.service'
    import eventHub from '@/services/shared/events.service'
    import alertService from '@/services/shared/alert.service'
    import toastrService from '@/services/shared/toastr.service'
    import requestService from '@/services/shared/request.service'
    import sessionsService from '@/services/sessions/session.service'
    import documentsService from '@/services/documents/document.service'
    import checklistService from '@/services/checklists/checklist.service'
    import tooltip from '@/directives/tooltip'
    import PageHeader from '@/components/layout/PageHeader'
    import Loading from '@/components/shared/Loading'
    import Pagination from '@/components/shared/Pagination'
    import IdtTable from '@/components/shared/IdtTable/IdtTable'
    import Multiselect from '@/components/shared/multi-select'
    import SessionModal from '@/components/sessions/maintenance/SessionModal'
    import ImagePreview from '@/components/sessions/maintenance/ImagePreview'
    import CheckItem from '@/components/shared/check-items/CheckItem'
    import {mapGetters, mapActions} from 'vuex'

    let loadingKeys = {
        fetchingSessions: 'fetching-sessions',
        fetchingSessionDocuments: 'fetching-session-documents',
        fetchingSessionTypes: 'fetching-session-types',
        fetchChecklistItems: 'fetch-checklist-items',
        fetchingDocumentsContent: 'fetching-documents-content',
        saveDocument: 'save-document'
    }

    const STATUS_INITIAL = 0, STATUS_WAITING = 1, STATUS_DOCUMENT_VALIDATED = 2

    export default {
        directives: {
            tooltip
        },

        components: {
            PageHeader,
            Loading,
            Pagination,
            Multiselect,
            SessionModal,
            ImagePreview,
            CheckItem
        },

        data () {
            return {
                cancelToken: null,
                session: {
                    state: null
                },
                sessionDetail: {
                    clientReference: null,
                    newClient: false,
                    observations: null
                },
                sessionTypes: [],
                checklistItems: [],
                completedChecklistItems: [],
                documents: [],
                sessionModalVisible: false,
                commandHub: siganlR.hubs.command,
                binaryHub: siganlR.hubs.binary,
                currentStatus: null,

                filter: {
                    ids: [],
                    state: '',
                    sessionTypeId: null,
                    sessionType: {}
                },

                report: {
                    title: 'Preview de imagem',
                    base64: null,
                    visible: false
                },

                orderBy: {
                    column: 'id',
                    direction: 'asc'
                },

                isRollingbackSessionType: false
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'getLastImageReceived',
                'getSessionId',
                'clientSessionStarted',
                'isChecklistCompleted'
            ]),

            isFetchingSessions () {
                return !!_.intersection(this.loadings, [
                    loadingKeys.fetchingSessions
                ]).length
            },

            isLoadingChecklistItems () {
                return !!_.intersection(this.loadings, [
                    loadingKeys.fetchChecklistItems
                ]).length
            },

            isLoadingSessionDocuments () {
                return !!_.intersection(this.loadings, [
                    loadingKeys.fetchingSessionDocuments
                ]).length
            },

            isLoadingSessionTypes () {
                return !!_.intersection(this.loadings, [
                    loadingKeys.fetchingSessionTypes
                ]).length
            },

            isLoadingDocumentsContent () {
                return !!_.intersection(this.loadings, [
                    loadingKeys.fetchingDocumentsContent
                ]).length
            },

            isSessionReadOnly () {
                return this.session.state === (sessionsService.sessions.states.FINALIZED || sessionsService.sessions.states.REOPENED)
            },

            emitDocumentLabel () {
                if (this.isValidated) {
                    return this.$i18n.t('sessions.general.validated')
                } else if (this.isWaiting) {
                    return this.$i18n.t('sessions.general.waiting-for-validation')
                } else {
                    return this.$i18n.t('sessions.general.send-document')
                }
            },

            sendButtonClass () {
                if (this.isWaiting) {
                    return 'waiting'
                } else  {
                    return 'normal'
                }
            },

            isInitial () {
                return this.currentStatus === STATUS_INITIAL
            },

            isWaiting () {
                return this.currentStatus === STATUS_WAITING
            },

            isValidated () {
                return this.currentStatus === STATUS_DOCUMENT_VALIDATED
            },

            canSendDocument () {
                return this.isInitial &&
                    this.filter.sessionType &&
                    this.filter.sessionType.checklistId !== null
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove',
                'setLastImageReceived',
                'checklistCompleted',
                'documentValidated',
                'clientReferenceCompleted',
            ]),

            updateChecklistItem (item, value) {
                var self = this

                item.done = value

                let parameters = {
                    filter: {
                        sessionId: self.getSessionId,
                        checklistItemIds: [item.id]
                    },
                    data: {
                        fields: {
                            done: value
                        }
                    }
                }

                return sessionsService.checklistItems.update(parameters).then(response => {
                    if (response.data.status === 'success') {
                    } else {
                        //TODO
                    }
                })
            },

            stateTranslation (session) {
                return this.$i18n.t('sessions.states.' + session.state)
            },

            formatDate (session) {
                return dateTimeService.fromServerToLocalString(session.createdAt, 'dateTime')
            },

            fetchSession () {
                let self = this

                if (_.isNil(this.getSessionId)) {
                    return Promise.resolve()
                }

                self.loadingAdd(loadingKeys.fetchingSessions)

                let parameters = {
                    filter : {
                        ids: [self.getSessionId]
                    }
                }

                return sessionsService.sessions.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.session = response.data.data.results[0]
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }

                    self.loadingRemove(loadingKeys.fetchingSessions)
                }).catch(exception => {
                    self.loadingRemove(loadingKeys.fetchingSessions)
                })
            },

            fetchSessionDetails () {
                let self = this

                if (_.isNil(this.getSessionId)) {
                    return Promise.resolve()
                }

                self.loadingAdd(loadingKeys.fetchingSessions)

                let orderBy = Object.assign({}, self.orderBy)

                let filter = Object.assign({}, self.filter, {
                    sessionIds: [self.getSessionId]
                })

                let parameters = {
                    filter,
                    pagination: self.pagination,
                    orderBy
                }

                return sessionsService.details.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.sessionDetail = response.data.data.results[0]
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }

                    self.loadingRemove(loadingKeys.fetchingSessions)
                }).catch(exception => {
                    self.loadingRemove(loadingKeys.fetchingSessions)
                })
            },

            fetchChecklistItems () {
                let self = this

                if (!self.getSessionId || !self.sessionDetail) {
                    return Promise.resolve()
                }

                self.loadingAdd(loadingKeys.fetchChecklistItems)

                let parameters = {
                    filter: {
                        checklistId: self.filter.sessionType.checklistId,
                        active: true
                    },

                    orderBy: {
                        column: 'rank',
                        direction: 'asc'
                    }
                }

                return checklistService.items.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.checklistItems = response.data.data.results
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }

                    self.loadingRemove(loadingKeys.fetchChecklistItems)
                })
            },

            fetchCompletedChecklistItems () {
                let self = this

                let parameters = {
                    filter: {
                        ids: [this.getSessionId]
                    }
                }

                return sessionsService.checklistItems.completedChecklistItems(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.completedChecklistItems = response.data.data

                        self.checklistItems.map((element) => {
                            return element.done = (_.findIndex(self.completedChecklistItems, (data) => { return data.id === element.id }) != -1)
                        })



                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }
                })
            },

            fetchSessionTypes () {
                let self = this

                self.loadingAdd(loadingKeys.fetchingSessionTypes)

                let parameters = {
                    filter: {
                        active: true
                    }
                }

                return sessionsService.sessionTypes.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.sessionTypes = response.data.data.results
                        var selectedItem = _.find(self.sessionTypes, {id: self.session.sessionTypeId})
                        self.filter.sessionType  = selectedItem
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }

                    self.loadingRemove(loadingKeys.fetchingSessionTypes)
                })
            },

            fetchSessionDocuments () {
                let self = this

                if (_.isNil(this.getSessionId) || !self.sessionDetail) {
                    return Promise.resolve()
                }

                self.loadingAdd(loadingKeys.fetchingDocuments)

                let parameters = {
                    filter: {
                        sessionId: self.getSessionId
                    },

                    orderBy: self.orderBy
                }

                return sessionsService.documents.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.sessionDetail.documents = response.data.data.results
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }

                    self.loadingRemove(loadingKeys.fetchingDocuments)
                })
            },

            fetchDocumentsContent () {
                let self = this

                if (!self.sessionDetail) {
                    return Promise.resolve()
                }

                self.loadingAdd(loadingKeys.fetchingDocumentsContent)

                let parameters = {
                    filter: {
                        ids: self.sessionDetail.documents.map(document => document.id)
                    }
                }

                return documentsService.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.documents = response.data.data.results
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }

                    self.loadingRemove(loadingKeys.fetchingDocumentsContent)
                })
            },

            deleteSessionDocuments () {
                let self = this

                if (self.isSessionReadOnly) {
                    return
                }

                if (!self.getSessionId || (!self.sessionDetail)) {
                    return Promise.resolve()
                }

                self.loadingAdd(loadingKeys.deletingDocuments)

                let parameters = {
                    filter: {
                        sessionId: self.getSessionId,
                        documentIds: self.sessionDetail.documents.map(document => document.id)
                    }
                }

                return sessionsService.documents.delete(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.sessionDetail.documents = []
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }

                    self.loadingRemove(loadingKeys.deletingDocuments)
                })

            },

            recreateSessionChecklistItems () {
                let self = this

                if (self.isSessionReadOnly) {
                    return
                }

                if (!self.getSessionId || (!self.sessionDetail)) {
                    return Promise.resolve()
                }

                // self.loadingAdd(loadingKeys.deletingDocuments)

                let parameters = {
                    filter: {
                        sessionId: self.getSessionId,
                        // documentIds: self.sessionDetail.documents.map(document => document.id)
                    }
                }

                return sessionsService.checklistItems.delete(parameters).then(response => {
                    if (response.data.status === 'success') {
                        // self.sessionDetail.documents = []
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }

                    // self.loadingRemove(loadingKeys.deletingDocuments)
                }).then(() => {
                    let parameters = {
                        data: {
                            sessionId: self.getSessionId
                        }
                    }

                    return sessionsService.checklistItems.create(parameters).then(response => {
                        if (response.data.status === 'success') {
                            // self.sessionDetail.documents = []
                        } else {
                            return Promise.reject(new Error(response.data.message))
                        }

                        // self.loadingRemove(loadingKeys.deletingDocuments)
                    })
                })
            },

            deleteSessionDocument (documentId) {
                let self = this

                if (!self.getSessionId) {
                    return Promise.resolve()
                }

                self.loadingAdd(loadingKeys.deletingDocuments)

                alertService.advanced({
                    title: 'Tem certeza que deseja remover a imagem?',
                    type: 'warning',
                    showCancelButton: true
                }).then(() => {

                    let parameters = {
                        filter: {
                            sessionId: self.getSessionId,
                            documentIds: [documentId]
                        }
                    }

                    return sessionsService.documents.delete(parameters).then(response => {
                        if (response.data.status === 'success') {
                            self.removeDocument(documentId)
                        } else {
                            return Promise.reject(new Error(response.data.message))
                        }

                        self.loadingRemove(loadingKeys.deletingDocuments)
                    })

                }).catch(exception => {
                    self.loadingRemove(loadingKeys.deletingDocuments)
                })
            },

            createDocument (newDocument) {
                let self = this

                self.loadingAdd(loadingKeys.saveDocument)

                let parameters = {
                    data: {
                        sessionId: self.getSessionId,
                        checklistId: newDocument.checklistId,
                        checklistItemId: newDocument.checklistItemId,
                        documentContent: newDocument.content
                    }
                }

                return sessionsService.documents.create(parameters).then(response => {
                    if (response.data.status === 'success') {
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }

                    self.loadingRemove(loadingKeys.saveDocument)
                })
            },

            documentFilter (documentFilter) {
                if (this.documents.length > 0) {
                    return this.documents.find(document => document.id === documentFilter)
                }
            },

            displayImage (imageId) {
                let document = this.documentFilter(imageId)

                if (document && document.content) {
                    return document.content.startsWith('data:image') ? document.content : 'data:image;base64,' +  document.content
                } else {
                    return '/static/assets/default-thumbnail.jpg'
                }
            },

            uploadDocumentClicked () {
                this.$refs.uploadDocument.click()
            },

            sendDocument () {
                let self = this

                if (!this.canSendDocument) {
                    return
                }

                let files = self.$refs.uploadDocument.files

                if (!files.length) {
                    return
                }

                if (files[0].type !== 'application/pdf') {
                    alertService.error('O ficheiro deve estar em formato PDF.')

                    return
                }

                // Get base64
                let reader = new FileReader()

                reader.readAsDataURL(files[0])

                reader.onload = () => {
                    self.setLastImageReceived(null)

                    self.emitDocument(reader.result.split(',')[1])
                }
            },

            applyFilter (newSessionType, oldSessionType) {
                let self = this

                self.$nextTick(() => {
                    alertService.advanced({
                        title: 'Ao mudar esta opção, todos os detalhes desta sessão irão ser eliminados.<br>Tem a certeza que pretende continuar?',
                        type: 'warning',
                        showCancelButton: true
                    }).then(() => {
                        this.updateSessionType()
                        this.fetchChecklistItems().then(() => {
                            return self.fetchDocumentsContent()
                        }).then(() => {
                            return Promise.all([
                                self.deleteSessionDocuments(),
                                self.recreateSessionChecklistItems()
                            ])
                        })
                    }).catch(exception => {
                        self.isRollingbackSessionType = true
                        self.filter.sessionType = oldSessionType
                    })
                })
            },

            saveDocument () {
                var self = this

                let storeDocument = self.getLastImageReceived

                if (!storeDocument) {
                    return
                }

                let newDocument = {
                    id: storeDocument.guid,
                    content: storeDocument.content,
                    checklistId: self.filter.sessionType.checklistId,
                    checklistItemId: storeDocument.checklistItemId
                }

                self.createDocument(newDocument).then(() => {
                    return self.fetchSessionDocuments()
                }).then(() => {
                    return self.fetchDocumentsContent()
                })
            },

            removeDocument (documentId) {
                var self = this

                self.sessionDetail.documents = _.pull(self.sessionDetail.documents, _.find(self.sessionDetail.documents, {documentId: documentId}))
                self.$set(self.documents, _.pull(self.documents, _.find(self.documents, {id: documentId})))
            },

            previewImage (image) {
                var self = this

                let document = self.documentFilter(image.id)
                if (document != null) {
                    self.report.base64 = document.content
                    self.report.visible = true
                }
            },

            exportImage (image, ref) {
                var self = this

                let imageData = self.displayImage(image.id)
                let blob = self.dataURItoBlob(imageData)
                fileSaver.saveAs(blob, image.id + '.png')
            },

            dataURItoBlob (dataURI) {
                // convert base64 to raw binary data held in a string
                // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
                var byteString = atob(dataURI.split(',')[1])

                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

                // write the bytes of the string to an ArrayBuffer
                var ab = new ArrayBuffer(byteString.length)

                // create a view into the buffer
                var ia = new Uint8Array(ab)

                // set the bytes of the buffer to the correct values
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i)
                }

                // write the ArrayBuffer to a blob, and you're done
                var blob = new Blob([ab], {type: mimeString})

                return blob
            },

            updateSessionType () {
                var self = this

                let parameters = {
                    filter: {
                        ids: [self.getSessionId]
                    },
                    data: {
                        fields: {
                            sessionTypeId: self.filter.sessionType.id
                        }
                    }
                }

                return sessionsService.sessions.update(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.sessionDetail.checklistId = self.filter.sessionType.checklistId

                        self.saveSessionDetails()
                    } else {
                        //TODO
                    }
                })
            },

            saveSessionDetails (sessionId) {
                let self = this

                if (_.isNil(self.getSessionId || sessionId)) {
                    Promise.resolve()
                }

                let parameters = {
                    filter: {
                        sessionIds: [self.getSessionId || sessionId]
                    },
                    data: {
                        fields: {
                            checklistId: self.sessionDetail.checklistId,
                            newClient: self.sessionDetail.newClient,
                            clientReference: self.sessionDetail.clientReference,
                            observations: self.sessionDetail.observations
                        }
                    }
                }

                return sessionsService.details.update(parameters).then(response => {
                    if (response.data.status === 'success') {
                    } else {
                        //TODO
                    }
                })
            },

            emitImageValidated () {
                let message = {
                    isValid : true
                }
                this.commandHub.connection.invoke('ImageValidated', message).then(() => {
                    // TODO
                }).catch(() => {

                })
            },

            emitDocument (documentBinary) {
                let self = this

                let document = {
                    documentBinary
                }

                self.binaryHub.connection.invoke('ReceiveDocument', document).then(() => {
                    self.currentStatus = STATUS_WAITING
                }).catch(() => {

                })
            },

            updateDocumentState () {
                let self = this

                self.currentStatus = STATUS_DOCUMENT_VALIDATED

                toastrService.info('', this.$i18n.t('sessions.general.success-document-validation'))
            },

            getData () {
                let self = this

                self.documentValidated(false)
                self.clientReferenceCompleted(false)
                self.checklistCompleted(false)

                self.fetchSession().then(() => {
                    return self.fetchSessionDetails()
                }).then(() => {
                    return self.fetchSessionDocuments()
                }).then(() => {
                    return self.fetchSessionTypes()
                }).then(() => {
                    return self.fetchChecklistItems()
                }).then(() => {
                    if (self.sessionDetail.documents) {
                        self.fetchDocumentsContent()
                    }
                })
            },

            checklistItemDescription (itemId) {
                let item = _.find(this.checklistItems, {id: itemId})

                return this.checklistItems.length > 0 ? item.description || '' : ''
            }
        },

        watch: {
            '$route' (to, from) {
                if (to.path === '/new-session/') {
                    this.getData()
                    this.currentStatus = STATUS_INITIAL
                }
            },

            'documents' () {
                this.fetchCompletedChecklistItems()
            },

            'sessionDetail.clientReference' (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (!_.isEmpty(newValue)) {
                        this.clientReferenceCompleted(true)
                    } else {
                        this.clientReferenceCompleted(false)
                    }
                }
            },

            'currentStatus' (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (newValue === STATUS_DOCUMENT_VALIDATED) {
                        this.documentValidated(true)
                    } else {
                        this.documentValidated(false)
                    }
                }
            },

            'checklistItems': {
                handler: function (checklist) {
                    var vm = this

                    let checklistComplete = true

                    _.forEach(checklist, item => {
                        if (!item.done) {
                            checklistComplete = false
                            return
                        }
                    })

                    vm.checklistCompleted(checklistComplete)

                    if (checklistComplete) {
                        console.log('Checklist complete.')
                    } else {
                        console.log('Checklist incomplete.')
                    }
                },
                deep: true
            },

            'filter.sessionType' (newValue, oldValue) {
                if(oldValue.id && newValue.id !== oldValue.id) {
                    if (!this.isRollingbackSessionType) {
                        this.applyFilter(newValue, oldValue)
                    } else {
                        this.isRollingbackSessionType = false
                    }
                }
            }
        },

        created () {
            this.getData()
            // this.debouncedSaveSessionDetails = _.debounce(this.saveSessionDetails, 500)

            this.currentStatus = STATUS_INITIAL
            eventHub.$on('document-validated', this.updateDocumentState)
            eventHub.$on('save-session-details', this.saveSessionDetails)
        },

        beforeDestroy () {
            eventHub.$off('document-validated', this.updateDocumentState)
            eventHub.$off('save-session-details', this.saveSessionDetails)
        },

        mounted () {
            // this.$watch(
            //     vm => [vm.sessionDetail.clientReference, vm.sessionDetail.newClient, vm.sessionDetail.observations].join(), val => {
            //         this.debouncedSaveSessionDetails()
            //     }
            // )
        },

        beforeRouteLeave (to, from, next) {
            this.saveSessionDetails().then(() => {
                next()
            })
        }

    }
</script>

<style>
</style>
