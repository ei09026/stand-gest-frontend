<template>
    <div class="session-types">
         <page-header
            :active-title="title"></page-header>

        <idt-table
            use-ordering
            clickable-rows
            use-filter
            use-search
            :table-min-height="tableMinHeight"
            search-debounce
            :columns="columns"
            column-key="name"
            column-label="title"
            :rows="sessionTypes"
            row-key="id"
            :search="filter.description"
            :search-placeholder="searchPlaceholder"
            :unorderable-columns="['active']"
            :orderBy="orderBy"
            :loading="isFetchingSessionTypes"
            :pagination="pagination"
            :has-filtered-results="hasFilteredResults"
            @search="search"
            @order="order"
            @row-clicked="openEditingSessionType"
            @filter="fetchSessionTypes"
            @filter-clear="clearFilter"
            @refresh="fetchSessionTypes">

            <template slot="filter">
                <div class="row">
                    <div class="col-lg-4 m-b-sm">
                        <label>{{$i18n.tc('general.active', 2)}}</label>

                        <div>
                            <div class="btn-group">
                                <radio-item
                                    button
                                    :val="null"
                                    v-model="filter.active">

                                    {{ $i18n.t('general.all') }}
                                </radio-item>

                                <radio-item class="m-l-sm"
                                    button
                                    :val="true"
                                    v-model="filter.active">

                                    <i class="fas fa-check"></i>

                                    {{ $i18n.tc('general.active', 2) }}
                                </radio-item>

                                <radio-item class="m-l-sm"
                                    button
                                    :val="false"
                                    v-model="filter.active">

                                    <i class="fas fa-ban"></i>

                                    {{ $i18n.tc('general.inactive', 2) }}
                                </radio-item>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template
                slot="cell"
                slot-scope="props">

                <i class="fa"
                    v-if="props.column.name === 'active'"
                    :class="{
                        'fa-check text-success': props.cell,
                        'fa-ban text-danger': !props.cell
                    }"></i>

                <template
                    v-else>

                    {{props.cell}}
                </template>
            </template>
        </idt-table>

        <modal xl
            :show="showSessionTypeEditModal"
            :title="sessionTypeEditModalTitle"
            :ok-text="$i18n.t('actions.save')"
            :ok-button-disabled="!isEditingSessionTypeValid"
            @ok="save"
            @close="closeEditingSessionType">

            <template
                v-if="editingSessionType">

                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <div class="form-group">
                            <label>Descrição</label>

                            <input class="form-control"
                                v-model="editingSessionType.description"
                                placeholder="Descrição">
                        </div>
                    </div>

                    <div class="col-md-5 col-lg-5">
                        <div class="form-group">
                            <label>Checklist</label>

                            <multiselect
                                v-model="editingSessionType.checklist"
                                :options="checklists"
                                :searchable="true"
                                :multiple="false"
                                :no-results-label="$i18n.t('general.no-results')"
                                track-by="id"
                                label="description"
                            ></multiselect>
                        </div>
                    </div>

                    <div class="col-md-1 col-lg-1">
                        <div class="form-group">
                            <label>Activo</label>

                            <check-item
                                v-model="editingSessionType.active"
                                :disabled="false">
                            </check-item>
                        </div>
                    </div>
                </div>
            </template>
        </modal>

        <button-bar>
            <button class="btn btn-circle btn-primary"
                v-tooltip="{title: $i18n.t('actions.add')}"
                @click="openEditingSessionType()">

                <i class="fa fa-plus"></i>
            </button>
        </button-bar>
    </div>
</template>

<script>
    import _ from 'lodash'
    import RadioItem from '@/components/shared/input/RadioItem'
    import sessionsServices from '@/services/sessions/session.service'
    import checklistsServices from '@/services/checklists/checklist.service'
    import PageHeader from '@/components/layout/PageHeader'
    import requestService from '@/services/shared/request.service'
    import tooltip from '@/directives/tooltip'
    import ButtonBar from '@/components/shared/ButtonBar'
    import Modal from '@/components/shared/Modal'
    import IdtTable from '@/components/shared/IdtTable/IdtTable'
    import CheckItem from '@/components/shared/check-items/CheckItem'
    import Multiselect from '@/components/shared/multi-select'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        directives: {
            tooltip
        },

        components: {
            PageHeader,
            ButtonBar,
            Modal,
            IdtTable,
            CheckItem,
            Multiselect,
            RadioItem
        },

        data () {
            return {
                title: 'Motivos',

                sessionTypes: [],

                checklists: [],

                filter: {
                    description: '',
                    active: null
                },

                pagination: {
                    itemsPerPage: 25,
                    page: 1,
                    totalItems: 0
                },

                orderBy: {
                    column: 'description',
                    direction: 'asc'
                },

                columns: [
                    {
                        name: 'description',
                        title: 'Descrição'
                    },
                    {
                        name: 'checklist.description',
                        title: 'Checklist',
                    },
                    {
                        name: 'active',
                        title: 'Activo'
                    }
                ],

                showSessionTypeEditModal: false,

                editingSessionType: null
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize'
            ]),

            isFetchingSessionTypes () {
                return this.loadings.indexOf('configurations-fetching-types') >= 0
            },

            hasFilteredResults () {
                return !!(this.filter.description || this.filter.active !== null)
            },

            searchPlaceholder () {
                let placeholder = [
                    'descrição'
                ].join(', ')

                return placeholder.charAt(0).toUpperCase() + placeholder.slice(1).toLowerCase()
            },

            isEditingSessionTypeValid () {
                return !!(this.editingSessionType &&
                    this.editingSessionType.description && this.editingSessionType.checklist)
            },

            sessionTypeEditModalTitle () {
                if (!this.editingSessionType) {
                    return null
                }

                return this.editingSessionType.id
                    ? 'Editar motivo'
                    : 'Novo motivo'
            },

            tableMinHeight () {
                return this.pageContentSize.height - 455
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            fetchCheckLists () {
                let self = this

                self.loadingAdd('configurations-fetching-checklists')

                let parameters = {
                    orderBy: {
                        column: 'description',
                        direction: 'asc'
                    }
                }

                return checklistsServices.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.checklists = response.data.data.results
                    } else {
                        // TODO
                    }

                    self.loadingRemove('configurations-fetching-checklists')
                }).catch(exception => {
                    throw exception
                })
            },

            fetchSessionTypes () {
                let self = this

                self.loadingAdd('configurations-fetching-session-types')

                let parameters = {
                    filter: self.filter,
                    pagination: self.pagination,
                    orderBy: self.orderBy
                }

                return sessionsServices.sessionTypes.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        _.forEach(response.data.data.results, (value, key) => {
                            value.checklist = _.find(self.checklists, (data) => { return data.id === value.checklistId })
                        });

                        self.sessionTypes = response.data.data.results
                        self.pagination.totalItems = response.data.data.totalItems
                    } else {
                        // TODO
                    }

                    self.loadingRemove('configurations-fetching-session-types')
                }).catch(exception => {
                    throw exception
                })
            },

            search (value) {
                this.filter.description = value

                this.fetchSessionTypes()
            },

            order (orderBy) {
                this.orderBy = orderBy

                this.fetchSessionTypes()
            },

            clearFilter () {
                this.filter.description = ''
                this.filter.active = null

                this.fetchSessionTypes()
            },

            openEditingSessionType (sessionType) {
                let editingSessionType = {
                    id: null,
                    description: '',
                    checklistId: null,
                    active: true
                }

                // Edit
                if (sessionType) {
                    Object.assign(editingSessionType, sessionType)
                }

                this.editingSessionType = editingSessionType
                this.showSessionTypeEditModal = true
            },

            closeEditingSessionType () {
                this.showSessionTypeEditModal = false
                this.editingSessionType = null
            },

            save () {
                let self = this

                self.loadingAdd('configurations-saving-session-types')

                let parameters = {}
                let request = null

                if (self.editingSessionType.id) { // Edit
                    parameters = {
                        data: {
                            fields: {
                                description: self.editingSessionType.description,
                                checklistId: self.editingSessionType.checklist.id,
                                active: self.editingSessionType.active
                            }
                        },
                        filter: {
                            ids: [self.editingSessionType.id]
                        }
                    }

                    request = sessionsServices.sessionTypes.update(parameters)
                } else { // New
                    parameters = {
                        data: {
                            description: self.editingSessionType.description,
                            checklistId: self.editingSessionType.checklist.id,
                            active: self.editingSessionType.active
                        }
                    }

                    request = sessionsServices.sessionTypes.create(parameters)
                };

                return request.then(response => {
                    if (response.data.status === 'success') {
                        self.fetchSessionTypes()
                    } else {
                        //TODO
                    }

                    self.closeEditingSessionType()
                    self.loadingRemove('configurations-saving-session-types')
                })
            }
        },

        created () {
            this.fetchCheckLists().then(()=> {
                this.fetchSessionTypes()
            })
        }
    }

</script>