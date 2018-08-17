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
            :rows="colors"
            row-key="id"
            :search="filter.description"
            :search-placeholder="searchPlaceholder"
            :unorderable-columns="['active']"
            :orderBy="orderBy"
            :loading="isFetchingColors"
            :pagination="pagination"
            :has-filtered-results="hasFilteredResults"
            @search="search"
            @order="order"
            @row-clicked="openColorManagement"
            @filter="fetchColors"
            @filter-clear="clearFilter"
            @refresh="fetchColors"
            @page-changed="pageChanged">

            <template slot="filter">
                <div class="row">
                    <div class="col-lg-4">
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
                    }">
                </i>

                <template
                    v-else>

                    {{props.cell}}
                </template>
            </template>
        </idt-table>

        <modal xl
            :show="showColorManagementModal"
            :title="colorManagementModalTitle"
            :ok-text="$i18n.t('actions.save')"
            :ok-button-disabled="!isColorManagementValid"
            @ok="save"
            @close="closeColorManagement">

            <template
                v-if="colorDto">

                <div class="row">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Descrição</label>

                            <input id="itemDescription" class="form-control"
                                v-model="colorDto.description"
                                placeholder="Descrição">
                        </div>
                    </div>

                    <div class="col-lg-1">
                        <div class="form-group">
                            <label>Activo</label>

                            <check-item
                                v-model="colorDto.active">
                            </check-item>
                        </div>
                    </div>
                </div>
            </template>
        </modal>

        <button-bar>
            <button class="btn btn-circle btn-primary"
                v-tooltip="{title: $i18n.t('actions.add')}"
                @click="openColorManagement()">

                <i class="fa fa-plus"></i>
            </button>
        </button-bar>
    </div>
</template>

<script>
    import _ from 'lodash'
    import CheckItem from '@/components/shared/check-items/CheckItem'
    import requestService from '@/services/shared/request.service'
    import toastrService from '@/services/shared/toastr.service'
    import IdtTable from '@/components/shared/IdtTable/IdtTable'
    import RadioItem from '@/components/shared/input/RadioItem'
    import Multiselect from '@/components/shared/multi-select'
    import colorsService from '@/services/colors/colors.service'
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
                title: 'Cores',

                colors: [],

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

                showColorManagementModal: false,

                colorDto: null
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize'
            ]),

            isFetchingColors () {
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

            isColorManagementValid () {
                return !!(this.colorDto &&
                    this.colorDto.description)
            },

            colorManagementModalTitle () {
                if (!this.colorDto) {
                    return null
                }

                return this.colorDto.id
                    ? 'Editar color'
                    : 'Novo color'
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
                this.fetchColors();
            },

            fetchColors () {
                let self = this

                self.loadingAdd('configurations-fetching-colors')

        

                let parameters = {
                    filter: self.filter,
                    pagination: self.pagination,
                    orderBy: self.orderBy,
                    method: 'retrieve'
                }

                return colorsService.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.colors = response.data.data.data
                        self.pagination.totalItems = response.data.data.total
                    } else {
                        // TODO
                    }

                    self.loadingRemove('configurations-fetching-colors')
                }).catch(exception => {
                    throw exception
                })
            },

            search (value) {
                this.filter.description = value

                this.fetchColors()
            },

            order (orderBy) {
                this.orderBy = orderBy

                this.fetchColors()
            },

            clearFilter () {
                this.filter.description = ''
                this.filter.active = null

                this.fetchColors()
            },

            openColorManagement (color) {
                let colorDto = {
                    id: null,
                    description: '',
                    active: true,
                }

                // Edit
                if (color) {
                    Object.assign(colorDto, color)

                    if (color.deleted_at) {
                        colorDto.active = false
                    }
                    // fetch models this.fetchChecklistItems(editingChecklists.id)
                }

                this.colorDto = colorDto
                this.showColorManagementModal = true
            },

            closeColorManagement () {
                this.showColorManagementModal = false
                this.colorDto = null
            },

            save () {
                let self = this

                self.loadingAdd('configurations-saving-fuel-type')

                let parameters = {}
                let request = null

                if (self.colorDto.id) { // Edit
                    parameters = {
                        data: {
                            description: self.colorDto.description,
                            active: self.colorDto.active
                        },
                        filter: {
                            id: self.colorDto.id
                        },
                        method: 'update'
                    }

                    request = colorsService.update(parameters)
                } else { // New
                    parameters = {
                        data: {
                            description: self.colorDto.description,
                            active: self.colorDto.active
                        },
                        method: 'create'
                    }

                    request = colorsService.create(parameters)
                };

                return request.then(response => {
                    if (response.data.status === 'success') {
                        toastrService.success(
                            self.$i18n.t('general.success'),
                            self.$i18n.t('general.success-save'),
                            {positionClass: 'login-toast-top-right'}
                        )

                        self.fetchColors()
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
                    self.closeColorManagement()
                    self.loadingRemove('configurations-saving-fuel-type')
                })
            },
        },

        watch: {
            'filter.active' () {
                this.fetchColors()
            }
        },

        created () {
            this.fetchColors()
        }
    }

</script>

<style>
    .editing {
        background-color: ghostwhite !important;
    }

</style>
