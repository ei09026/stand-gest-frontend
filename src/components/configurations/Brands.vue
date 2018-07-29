<template>
    <div class="checklists">
         <page-header
            :active-title="title"></page-header>

        <idt-table
            use-ordering
            clickable-rows
            use-filter
            use-search
            search-debounce
            :table-min-height="tableMinHeight"
            :columns="columns"
            column-key="name"
            column-label="title"
            :rows="brands"
            row-key="id"
            :search="filter.description"
            :search-placeholder="searchPlaceholder"
            :unorderable-columns="['active']"
            :orderBy="orderBy"
            :loading="isFetchingBrands"
            :pagination="pagination"
            :has-filtered-results="hasFilteredResults"
            @search="search"
            @order="order"
            @row-clicked="openEditingChecklists"
            @filter="fetchBrands"
            @filter-clear="clearFilter"
            @refresh="fetchBrands">

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
                    v-if="props.column.name === 'deleted_at'"
                    :class="{
                        'fa-check text-success': !props.cell,
                        'fa-ban text-danger': props.cell
                    }"></i>

                <template
                    v-else>

                    {{props.cell}}
                </template>
            </template>

        </idt-table>

        <modal xl
            :show="showChecklistsEditModal"
            :title="checklistEditModalTitle"
            :ok-text="$i18n.t('actions.save')"
            :ok-button-disabled="!isEditingChecklistsValid"
            @ok="save"
            @close="closeEditingChecklists">

            <template
                v-if="editingChecklists">

                <div class="row">
                    <div class="col-md-6 col-lg-11">
                        <div class="form-group">
                            <label>Descrição</label>

                            <input id="itemDescription" class="form-control"
                                v-model="editingChecklists.description"
                                placeholder="Descrição">
                        </div>
                    </div>

                    <div class="col-md-1 col-lg-1">
                        <div class="form-group">
                            <label>Activo</label>

                            <check-item
                                v-model="editingChecklists.active">
                            </check-item>
                        </div>
                    </div>

                    <div class="row"
                        v-if="editingChecklists.id">
                        <div class="col-lg-12">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <button class="btn btn-success btn-circle btn-outline m-t-n-xs m-l-sm pull-right"
                                        :class="{'disabled': (!isEditingChecklistsValid)}"
                                        v-tooltip="{title: $i18n.t('checklists.add-new-item')}"
                                        @click="openNewItem">

                                        <i class="fa fa-plus"></i>
                                    </button>
                                    <div class="row">
                                        <div class="col-xs-6">Descrição</div>
                                        <div class="col-xs-2">Nº Páginas</div>
                                        <div class="col-xs-2">Só Leitura</div>
                                        <div class="col-xs-1">Ativo</div>
                                    </div>
                                </div>

                                <div class="list-group">
                                    <div class="list-group-item editing"
                                        v-if="newItem">
                                        <template
                                            v-if="!isSavingNewItem">
                                            
                                            <div class="row">
                                                    <div class="col-xs-6">
                                                        <input class="form-control"
                                                            v-model="newItem.description"/>

                                                    </div>
                                                    <div class="col-xs-2">
                                                        <input type="number" class="form-control"
                                                            v-model="newItem.pages"/>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <check-item
                                                            v-model="newItem.readonly">
                                                        </check-item>
                                                    </div>
                                                    <div class="col-xs-1">
                                                        <check-item
                                                            v-model="newItem.active">
                                                        </check-item>
                                                    </div>

                                                <div>
                                                    <button class="btn btn-success btn-circle btn-outline"
                                                        :class="{'disabled': false}"
                                                        v-tooltip="{title: (true ? $i18n.t('actions.save') : 'invalid!')}"
                                                        @click="saveItem(newItem)">

                                                        <i class="fa fa-save"></i>
                                                    </button>

                                                    <button class="btn btn-danger btn-circle btn-outline m-l-xs"
                                                        v-tooltip="{title: $i18n.t('actions.cancel')}"
                                                        @click="closeNewItem">

                                                        <i class="fa fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>

                                        </template>

                                    </div>

                                    <div class="list-group claim-list">
                                        <draggable v-model="checklistItems" class="dragArea" @update="onUpdate">
                                            <div class="list-group-item draggable"
                                                :key="checklistItem.id"
                                                v-for="checklistItem in checklistItems">
                                                <div class="row">
                                                    <div class="col-xs-6" v-text="checklistItem.description"></div>
                                                    <div class="col-xs-2" v-text="checklistItem.pages"></div>
                                                    <div class="col-xs-2">
                                                        <i class="fa"
                                                            :class="{
                                                                'fa-check text-success': checklistItem.readonly,
                                                                'fa-ban text-danger': !checklistItem.readonly
                                                            }"></i>
                                                    </div>

                                                    <div class="col-xs-1">
                                                        <i class="fa"
                                                            :class="{
                                                                'fa-check text-success': checklistItem.active,
                                                                'fa-ban text-danger': !checklistItem.active
                                                            }"></i>
                                                    </div>

                                                    <div>
                                                        <button class="btn btn-primary btn-circle btn-outline"
                                                            v-tooltip="{title: $i18n.t('actions.change')}"
                                                            @click="editItem(checklistItem)">

                                                            <i class="fas fa-pencil-alt"></i>
                                                        </button>

                                                        <button class="btn btn-danger btn-circle btn-outline m-l-xs"
                                                            v-tooltip="{title: $i18n.t('actions.delete')}"
                                                            @click="removeItem(checklistItem)">

                                                            <i class="fa fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </draggable>
                                    </div>
                                 </div>
                            </div>
                        </div>
                    </div>

                </div>
            </template>
        </modal>

        <button-bar>
            <button class="btn btn-circle btn-primary"
                v-tooltip="{title: $i18n.t('actions.add')}"
                @click="openEditingChecklists()">

                <i class="fa fa-plus"></i>
            </button>
        </button-bar>
    </div>
</template>

<script>
    import _ from 'lodash'
    import Draggable from 'vuedraggable'
    import RadioItem from '@/components/shared/input/RadioItem'
    import sessionsServices from '@/services/sessions/session.service'
    import brandService from '@/services/brands/brand.service'
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
            RadioItem,
            Draggable
        },

        data () {
            return {
                title: 'Marcas',

                newItem: null,

                isSavingNewItem: false,

                brands: [],

                checklistItems: [],

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
                        name: 'deleted_at',
                        title: 'Activo'
                    }
                ],

                showChecklistsEditModal: false,

                editingChecklists: null
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize'
            ]),

            isFetchingBrands () {
                return this.loadings.indexOf('configurations-fetching-brands') >= 0
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

            isEditingChecklistsValid () {
                return !!(this.editingChecklists &&
                    this.editingChecklists.description && !this.newItem)
            },

            checklistEditModalTitle () {
                if (!this.editingChecklists) {
                    return null
                }

                return this.editingChecklists.id
                    ? 'Editar checklist'
                    : 'Nova checklist'
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

            onUpdate () {
                let self = this

                _.forEach(this.checklistItems, (item, index) => {
                    item.rank = index
                    self.saveItem(item)
                });
            },

            openNewItem () {
                this.newItem = {
                    id: null,
                    pages: 0,
                    readonly: false,
                    active: true
                }
            },

            closeNewItem () {
                this.newItem = null
            },

            editItem (item)
            {
                this.newItem = _.clone(item)
            },

            saveItem (item) {
                let self = this

                self.loadingAdd('configurations-saving-checklistItem')

                let parameters = {}
                let request = null

                if (item.id) { // Edit
                    parameters = {
                        data: {
                            fields: {
                                description: item.description,
                                pages: item.pages,
                                readonly: item.readonly,
                                active: item.active,
                                rank: item.rank
                            }
                        },
                        filter: {
                            ids: [item.id]
                        }
                    }

                    request = brandService.items.update(parameters)
                } else { // New
                    parameters = {
                        data: {
                            checklistId: self.editingChecklists.id,
                            description: item.description,
                            pages: item.pages,
                            readonly: item.readonly,
                            active: item.active,
                            rank: self.checklistItems.length + 1
                        }
                    }

                    request = brandService.items.create(parameters)
                };

                return request.then(response => {
                    if (response.data.status === 'success') {
                        self.fetchChecklistItems(self.editingChecklists.id)
                    } else {
                        //TODO
                    }

                    self.closeNewItem()
                    self.loadingRemove('configurations-saving-checklistItem')
                })
            },

            fetchBrands () {
                let self = this

                self.loadingAdd('configurations-fetching-brands')

                let parameters = {
                    filter: self.filter,
                    pagination: self.pagination,
                    orderBy: self.orderBy
                }

                return brandService.retrieve(parameters).then(response => {                    
                    if (response.data.status === 'success') {
                        self.brands = response.data.data.data
                        self.pagination.totalItems = response.data.data.total
                    } else {
                        // TODO
                    }

                    self.loadingRemove('configurations-fetching-brands')
                }).catch(exception => {
                    throw exception
                })
            },

            search (value) {
                this.filter.description = value

                this.fetchBrands()
            },

            order (orderBy) {
                this.orderBy = orderBy

                this.fetchBrands()
            },

            clearFilter () {
                this.filter.description = ''
                this.filter.active = null

                this.fetchBrands()
            },

            openEditingChecklists (checklist) {
                let editingChecklists = {
                    id: null,
                    description: '',
                    checklistId: null,
                    active: true
                }

                // Edit
                if (checklist) {
                    Object.assign(editingChecklists, checklist)
                    this.fetchChecklistItems(editingChecklists.id)
                } else {
                    this.checklistItems = []
                }

                this.editingChecklists = editingChecklists
                this.showChecklistsEditModal = true                
            },

            closeEditingChecklists () {
                this.showChecklistsEditModal = false
                this.editingChecklists = null
                this.newItem = null
            },

            save () {
                let self = this

                self.loadingAdd('configurations-saving-checklists')

                let parameters = {}
                let request = null

                if (self.editingChecklists.id) { // Edit
                    parameters = {
                        data: {
                            fields: {
                                description: self.editingChecklists.description,
                                active: self.editingChecklists.active
                            }
                        },
                        filter: {
                            ids: [self.editingChecklists.id]
                        }
                    }

                    request = brandService.update(parameters)
                } else { // New
                    parameters = {
                        data: {
                            description: self.editingChecklists.description,
                            active: self.editingChecklists.active
                        }
                    }

                    request = brandService.create(parameters)
                };

                return request.then(response => {
                    if (response.data.status === 'success') {
                        self.fetchBrands()
                        if (_.isNil(self.editingChecklists.id)) {
                            self.editingChecklists.id = response.data.data.id
                        }
                    } else {
                        //TODO
                    }
                    
                    self.loadingRemove('configurations-saving-checklists')
                })
            },

            fetchChecklistItems (checklistId) {
                let self = this

                self.loadingAdd('configurations-fetching-checklist-items')

                let parameters = {
                    filter: {
                        checklistId: checklistId
                    },
                    pagination: self.pagination,
                    orderBy: {
                        column: 'rank',
                        direction: 'asc'
                    }
                }

                return brandService.items.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.checklistItems = response.data.data.results
                    } else {
                        // TODO
                    }

                    self.loadingRemove('configurations-fetching-checklist-items')
                }).catch(exception => {
                    throw exception
                })
            }
        },

        watch: {
            'filter.active' () {
                this.fetchBrands()
            }
        },

        created () {
            this.fetchBrands()
        }
    }

</script>

<style>
    .draggable {
        cursor: move;
    }

    .non-draggable {
        background-color: rgba(209, 218, 222, 0.38);
        cursor: auto;
    }

    .editing {
        background-color: ghostwhite !important;
    }

</style>
