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
            @row-clicked="openBrandManagement"
            @filter="fetchBrands"
            @filter-clear="clearFilter"
            @refresh="fetchBrands"
            @page-changed="pageChanged">

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
            :show="showBrandManagementModal"
            :title="brandManagementModalTitle"
            :ok-text="$i18n.t('actions.save')"
            :ok-button-disabled="!isBrandManagementValid"
            @ok="save"
            @close="closeBrandManagement">

            <template
                v-if="brandDto">

                <div class="row">
                    <div class="col-md-6 col-lg-11">
                        <div class="form-group">
                            <label>Descrição</label>

                            <input id="itemDescription" class="form-control"
                                v-model="brandDto.description"
                                placeholder="Descrição">
                        </div>
                    </div>

                    <div class="col-md-1 col-lg-1">
                        <div class="form-group">
                            <label>Activo</label>

                            <check-item
                                v-model="brandDto.active">
                            </check-item>
                        </div>
                    </div>
                </div>
            </template>
        </modal>

        <button-bar>
            <button class="btn btn-circle btn-primary"
                v-tooltip="{title: $i18n.t('actions.add')}"
                @click="openBrandManagement()">

                <i class="fa fa-plus"></i>
            </button>
        </button-bar>
    </div>
</template>

<script>
    import _ from 'lodash'
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
            RadioItem
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
                    itemsPerPage: 10,
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

                showBrandManagementModal: false,

                brandDto: null
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

            isBrandManagementValid () {
                return !!(this.brandDto &&
                    this.brandDto.description && !this.newItem)
            },

            brandManagementModalTitle () {
                if (!this.brandDto) {
                    return null
                }

                return this.brandDto.id
                    ? 'Editar marca'
                    : 'Nova marca'
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

            saveBrand (brand) {
                let self = this

                self.loadingAdd('configurations-saving-brand')

                let parameters = {}
                let request = null

                if (brand.id) { // Edit
                    parameters = {
                        id: brand.id,
                        description: brand.description,                                
                        active: brand.active
                    }

                    request = brandService.update(parameters)
                } else { // New
                    parameters = {
                        description: brand.description,                                
                        active: brand.active
                    }

                    request = brandService.create(parameters)
                };

                return request.then(response => {
                    if (response.data.status === 'success') {
                        self.fetchBrands()
                    } else {
                        //TODO
                    }

                    self.closeNewItem()
                    self.loadingRemove('configurations-saving-brand')
                })
            },

            pageChanged (page) {
                this.pagination.page = page
                this.fetchBrands();
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

            openBrandManagement (brand) {
                let brandDto = {
                    id: null,
                    description: '',
                    active: true
                }

                // Edit
                if (brand) {
                    Object.assign(brandDto, brand)
                    // fetch models this.fetchChecklistItems(editingChecklists.id)
                } else {
                    //brand models  this.checklistItems = []
                }

                this.brandDto = brandDto
                this.showBrandManagementModal = true                
            },

            closeBrandManagement () {
                this.showBrandManagementModal = false
                this.brandDto = null
                this.newItem = null
            },

            save () {
                let self = this

                self.loadingAdd('configurations-saving-checklists')

                let parameters = {}
                let request = null

                if (self.brandDto.id) { // Edit
                    parameters = {
                        data: {
                            fields: {
                                description: self.brandDto.description,
                                active: self.brandDto.active
                            }
                        },
                        filter: {
                            ids: [self.brandDto.id]
                        }
                    }

                    request = brandService.update(parameters)
                } else { // New
                    parameters = {
                        data: {
                            description: self.brandDto.description,
                            active: self.brandDto.active
                        }
                    }

                    request = brandService.create(parameters)
                };

                return request.then(response => {
                    if (response.data.status === 'success') {
                        self.fetchBrands()
                        if (_.isNil(self.brandDto.id)) {
                            self.brandDto.id = response.data.data.id
                        }
                    } else {
                        //TODO
                    }
                    
                    self.loadingRemove('configurations-saving-checklists')
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
    .editing {
        background-color: ghostwhite !important;
    }

</style>
