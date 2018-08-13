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
            :rows="fuelTypes"
            row-key="id"
            :search="filter.description"
            :search-placeholder="searchPlaceholder"
            :unorderable-columns="['active']"
            :orderBy="orderBy"
            :loading="isFetchingfuelTypes"
            :pagination="pagination"
            :has-filtered-results="hasFilteredResults"
            @search="search"
            @order="order"
            @row-clicked="openFuelTypeManagement"
            @filter="fetchFuelTypes"
            @filter-clear="clearFilter"
            @refresh="fetchFuelTypes"
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
            :show="showFuelTypeManagementModal"
            :title="fuelTypeManagementModalTitle"
            :ok-text="$i18n.t('actions.save')"
            :ok-button-disabled="!isFuelTypeManagementValid"
            @ok="save"
            @close="closeFuelTypeManagement">

            <template
                v-if="fuelTypeDto">

                <div class="row">
                    <div class="col-md-6 col-lg-11">
                        <div class="form-group">
                            <label>Descrição</label>

                            <input id="itemDescription" class="form-control"
                                v-model="fuelTypeDto.description"
                                placeholder="Descrição">
                        </div>
                    </div>

                    <div class="col-md-1 col-lg-1">
                        <div class="form-group">
                            <label>Activo</label>

                            <check-item
                                v-model="fuelTypeDto.active">
                            </check-item>
                        </div>
                    </div>
                </div>
            </template>
        </modal>

        <button-bar>
            <button class="btn btn-circle btn-primary"
                v-tooltip="{title: $i18n.t('actions.add')}"
                @click="openFuelTypeManagement()">

                <i class="fa fa-plus"></i>
            </button>
        </button-bar>
    </div>
</template>

<script>
    import _ from 'lodash'
    import sessionsServices from '@/services/sessions/session.service'
    import CheckItem from '@/components/shared/check-items/CheckItem'
    import requestService from '@/services/shared/request.service'
    import toastrService from '@/services/shared/toastr.service'
    import IdtTable from '@/components/shared/IdtTable/IdtTable'
    import RadioItem from '@/components/shared/input/RadioItem'
    import Multiselect from '@/components/shared/multi-select'
    import fuelTypesService from '@/services/fuelTypes/fuelTypes.service'
    import PageHeader from '@/components/layout/PageHeader'
    import ButtonBar from '@/components/shared/ButtonBar'
    import Modal from '@/components/shared/Modal'
    import tooltip from '@/directives/tooltip'
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
                title: 'Tipos de combustível',

                fuelTypes: [],

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

                showFuelTypeManagementModal: false,

                fuelTypeDto: null
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize'
            ]),

            isFetchingfuelTypes () {
                return this.loadings.indexOf('configurations-fetching-fuel-types') >= 0
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

            isFuelTypeManagementValid () {
                return !!(this.fuelTypeDto &&
                    this.fuelTypeDto.description)
            },

            fuelTypeManagementModalTitle () {
                if (!this.fuelTypeDto) {
                    return null
                }

                return this.fuelTypeDto.id
                    ? 'Editar tipo combustível'
                    : 'Novo tipo combustível'
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

            pageChanged (page) {
                this.pagination.page = page
                this.fetchFuelTypes();
            },

            fetchFuelTypes () {
                let self = this

                self.loadingAdd('configurations-fetching-fuel-types')

                let parameters = {
                    filter: self.filter,
                    pagination: self.pagination,
                    orderBy: self.orderBy,
                    method: 'retrieve'
                }

                return fuelTypesService.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.fuelTypes = response.data.data.data
                        self.pagination.totalItems = response.data.data.total
                    } else {
                        // TODO
                    }

                    self.loadingRemove('configurations-fetching-fuel-types')
                }).catch(exception => {
                    throw exception
                })
            },

            search (value) {
                this.filter.description = value

                this.fetchFuelTypes()
            },

            order (orderBy) {
                this.orderBy = orderBy

                this.fetchFuelTypes()
            },

            clearFilter () {
                this.filter.description = ''
                this.filter.active = null

                this.fetchFuelTypes()
            },

            openFuelTypeManagement (fuelType) {
                let fuelTypeDto = {
                    id: null,
                    description: '',
                    active: true
                }

                // Edit
                if (fuelType) {
                    Object.assign(fuelTypeDto, fuelType)

                    if (fuelType.deleted_at) {
                        fuelTypeDto.active = false
                    }
                    // fetch models this.fetchChecklistItems(editingChecklists.id)
                }

                this.fuelTypeDto = fuelTypeDto
                this.showFuelTypeManagementModal = true
            },

            closeFuelTypeManagement () {
                this.showFuelTypeManagementModal = false
                this.fuelTypeDto = null
            },

            save () {
                let self = this

                self.loadingAdd('configurations-saving-fuel-type')

                let parameters = {}
                let request = null

                if (self.fuelTypeDto.id) { // Edit
                    parameters = {
                        data: {
                            description: self.fuelTypeDto.description,
                            active: self.fuelTypeDto.active
                        },
                        filter: {
                            id: self.fuelTypeDto.id
                        },
                        method: 'update'
                    }

                    request = fuelTypesService.update(parameters)
                } else { // New
                    parameters = {
                        data: {
                            description: self.fuelTypeDto.description,
                            active: self.fuelTypeDto.active
                        },
                        method: 'create'
                    }

                    request = fuelTypesService.create(parameters)
                };

                return request.then(response => {
                    if (response.data.status === 'success') {
                        toastrService.success(
                            self.$i18n.t('general.success'),
                            self.$i18n.t('general.success-save'),
                            {positionClass: 'login-toast-top-right'}
                        )

                        self.fetchFuelTypes()
                    } else {
                        //TODO
                        toastrService.error(
                        self.$i18n.t('general.error'),
                        response.data.error.message[0],
                        {positionClass: 'login-toast-top-right'})
                    }
                }).catch((error) => {
                    toastrService.error(
                        self.$i18n.t('general.error'),
                        self.$i18n.t('general.error'),
                        {positionClass: 'login-toast-top-right'})
                }).finally(() => {
                    self.closeFuelTypeManagement()
                    self.loadingRemove('configurations-saving-fuel-type')
                })
            }
        },

        watch: {
            'filter.active' () {
                this.fetchFuelTypes()
            }
        },

        created () {
            this.fetchFuelTypes()
        }
    }

</script>

<style>
    .editing {
        background-color: ghostwhite !important;
    }

</style>
