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
            :rows="vehicles"
            row-key="id"
            :search="filter.description"
            :search-placeholder="searchPlaceholder"
            :unorderable-columns="['active']"
            :orderBy="orderBy"
            :loading="isFetchingVehicles"
            :pagination="pagination"
            :has-filtered-results="hasFilteredResults"
            @search="search"
            @order="order"
            @row-clicked="openVehicleManagement"
            @filter="fetchVehicles"
            @filter-clear="clearFilter"
            @refresh="fetchVehicles"
            @page-changed="pageChanged">

            <template slot="filter">
                <div class="row">
                    <div class="col-lg-4 m-b-sm">
                        <label>Matrícula</label>

                        <div>                          
                            <masked-input class="form-control" v-model="filter.plate" mask="##-##-##" placeholder="Matrícula" />
                        </div>
                    </div>

                    <div class="col-lg-4 m-b-sm">
                        <label>Marca</label>

                        <div>
                            <input class="form-control"
                                v-model="filter.brandId"
                                placeholder="Marca">
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
            :show="showVehicleManagementModal"
            :title="vehicleManagementModalTitle"
            :ok-text="$i18n.t('actions.save')"
            :ok-button-disabled="!isVehicleManagementValid"
            @ok="save"
            @close="closeVehicleManagement">

            <template
                v-if="vehicleDto">

                <div class="row">
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label>Matrícula</label>

                            <masked-input class="form-control" 
                                v-model="vehicleDto.plate" 
                                mask="##-##-##" 
                                placeholder="Matrícula" />
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="form-group">
                            <label>Marca</label>

                            <multiselect
                                v-model="vehicleDto.plateId"
                                :options="brands"
                                :searchable="true"
                                :multiple="false"
                                :no-results-label="$i18n.t('general.no-results')"
                                track-by="id"
                                label="description"
                            ></multiselect>
                        </div>
                    </div>
                </div>
            </template>
        </modal>

        <button-bar>
            <button class="btn btn-circle btn-primary"
                v-tooltip="{title: $i18n.t('actions.add')}"
                @click="openVehicleManagement()">

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
    import vehicleService from '@/services/vehicles/vehicle.service'
    import brandService from '@/services/brands/brand.service'
    import PageHeader from '@/components/layout/PageHeader'
    import ButtonBar from '@/components/shared/ButtonBar'
    import Modal from '@/components/shared/Modal'
    import tooltip from '@/directives/tooltip'
    import {mapGetters, mapActions} from 'vuex'
    import MaskedInput from 'vue-masked-input'

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
            MaskedInput
        },

        data () {
            return {
                title: 'Clientes',

                vehicles: [],

                filter: {
                    plate: '',
                    brandId: null
                },

                pagination: {
                    itemsPerPage: 10,
                    page: 1,
                    totalItems: 0
                },

                orderBy: {
                    column: 'purchase_date',
                    direction: 'asc'
                },

                columns: [
                    {
                        name: 'plate',
                        title: 'Matrícula'
                    },
                    {
                        name: 'brand',
                        title: 'Marca'
                    }
                ],

                showVehicleManagementModal: false,

                vehicleDto: null
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize'
            ]),

            isFetchingVehicles () {
                return this.loadings.indexOf('configurations-fetching-vehicles') >= 0
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

            isVehicleManagementValid () {
                return !!(this.vehicleDto &&
                    this.vehicleDto.description && !this.newItem)
            },

            vehicleManagementModalTitle () {
                if (!this.vehicleDto) {
                    return null
                }

                return this.vehicleDto.id
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

            pageChanged (page) {
                this.pagination.page = page
                this.fetchVehicles();
            },

            fetchVehicles () {
                let self = this

                self.loadingAdd('configurations-fetching-vehicles')

                let parameters = {
                    filter: self.filter,
                    pagination: self.pagination,
                    orderBy: self.orderBy,
                    method: 'retrieve'
                }

                return vehicleService.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.vehicles = response.data.data.data
                        self.pagination.totalItems = response.data.data.total
                    } else {
                        // TODO
                    }

                    self.loadingRemove('configurations-fetching-vehicles')
                }).catch(exception => {
                    throw exception
                })
            },

            search (value) {
                this.filter.description = value

                this.fetchVehicles()
            },

            order (orderBy) {
                this.orderBy = orderBy

                this.fetchVehicles()
            },

            clearFilter () {
                this.filter.description = ''
                this.filter.active = null

                this.fetchVehicles()
            },

            openVehicleManagement (vehicle) {
                let vehicleDto = {
                    id: null,
                    description: '',
                    active: true
                }

                // Edit
                if (vehicle) {
                    Object.assign(vehicleDto, vehicle)

                    if (vehicle.deleted_at) {
                        vehicleDto.active = false
                    }
                    // fetch models this.fetchChecklistItems(editingChecklists.id)
                } else {
                    //vehicle models  this.checklistItems = []
                }

                this.vehicleDto = vehicleDto
                this.showVehicleManagementModal = true
            },

            closeVehicleManagement () {
                this.showVehicleManagementModal = false
                this.vehicleDto = null
                this.newItem = null
            },

            save () {
                let self = this

                self.loadingAdd('configurations-saving-vehicle')

                let parameters = {}
                let request = null
                
                if (self.vehicleDto.id) { // Edit
                    parameters = {
                        data: {
                            description: self.vehicleDto.description,
                            active: self.vehicleDto.active
                        },
                        filter: {
                            id: self.vehicleDto.id
                        },
                        method: 'update'
                    }

                    request = vehicleService.update(parameters)
                } else { // New
                    parameters = {
                        data: {
                            description: self.vehicleDto.description,
                            active: self.vehicleDto.active
                        },
                        method: 'create'
                    }

                    request = vehicleService.create(parameters)
                };

                return request.then(response => {
                    if (response.data.status === 'success') {
                        toastrService.success(
                            self.$i18n.t('general.success'),
                            self.$i18n.t('general.success-save'),
                            {positionClass: 'login-toast-top-right'}
                        )

                        self.fetchVehicles()
                    } else {
                        //TODO
                        toastrService.error(
                        self.$i18n.t('general.error'),
                        response.data.error.message[0],
                        {positionClass: 'login-toast-top-right'})
                    }

                    self.loadingRemove('configurations-saving-vehicle')
                }).catch((error) => {
                    toastrService.error(
                        self.$i18n.t('general.error'),
                        self.$i18n.t('general.error'),
                        {positionClass: 'login-toast-top-right'})
                }).finally(() => {
                    self.closeVehicleManagement()
                    self.loadingRemove('configurations-saving-vehicle')
                })
            },

            fetchBrands () {
                let self = this

                self.loadingAdd('configurations-fetching-brands')

                let parameters = {
                    method: 'retrieve'
                }

                return brandService.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {                        
                        self.brands = response.data.data
                    }

                    self.loadingRemove('configurations-fetching-brands')
                }).catch(exception => {
                    throw exception
                })
            }
        },

        watch: {
            'filter.active' () {
                this.fetchVehicles()
            }
        },

        created () {
            this.fetchVehicles()

            // Catalogs
            this.fetchBrands()
        }
    }

</script>

<style>
    .editing {
        background-color: ghostwhite !important;
    }

</style>
