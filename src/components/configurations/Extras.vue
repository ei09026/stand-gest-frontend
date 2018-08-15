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
            :rows="extras"
            row-key="id"
            :search="filter.description"
            :search-placeholder="searchPlaceholder"
            :unorderable-columns="['active']"
            :orderBy="orderBy"
            :loading="isFetchingExtras"
            :pagination="pagination"
            :has-filtered-results="hasFilteredResults"
            @search="search"
            @order="order"
            @row-clicked="openExtraManagement"
            @filter="fetchExtras"
            @filter-clear="clearFilter"
            @refresh="fetchExtras"
            @page-changed="pageChanged">

            <template slot="filter">
                <div class="row">
                    <div class="col-lg-5">
                        <div class="form-group">
                            <label>Rank</label>

                            <multiselect
                                v-model="filter.rank"
                                :options="ranks"
                                :searchable="true"
                                :multiple="false"
                                :no-results-label="$i18n.t('general.no-results')"
                                track-by="id"
                                label="description"
                                @input="fetchExtras"
                            ></multiselect>
                        </div>
                    </div>
                    
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

                <span
                     v-else-if="props.column.name === 'rank_id'">
                    {{ getRankDescriptionById(props.cell) }}
                </span>

                <template
                    v-else>

                    {{props.cell}}
                </template>
            </template>
        </idt-table>

        <modal xl
            :show="showExtraManagementModal"
            :title="extraManagementModalTitle"
            :ok-text="$i18n.t('actions.save')"
            :ok-button-disabled="!isExtraManagementValid"
            @ok="save"
            @close="closeExtraManagement">

            <template
                v-if="extraDto">

                <div class="row">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Descrição</label>

                            <input id="itemDescription" class="form-control"
                                v-model="extraDto.description"
                                placeholder="Descrição">
                        </div>
                    </div>

                    <div class="col-lg-5">
                        <div class="form-group">
                            <label>Rank</label>

                            <multiselect
                                v-model="extraDto.rank"
                                :options="ranks"
                                :searchable="true"
                                :multiple="false"
                                :no-results-label="$i18n.t('general.no-results')"
                                track-by="id"
                                label="description"
                            ></multiselect>
                        </div>
                    </div>

                    <div class="col-lg-1">
                        <div class="form-group">
                            <label>Activo</label>

                            <check-item
                                v-model="extraDto.active">
                            </check-item>
                        </div>
                    </div>
                </div>
            </template>
        </modal>

        <button-bar>
            <button class="btn btn-circle btn-primary"
                v-tooltip="{title: $i18n.t('actions.add')}"
                @click="openExtraManagement()">

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
    import extrasService from '@/services/extras/extras.service'
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
                title: 'Extras',

                extras: [],

                ranks: [
                    {
                        id: 1,
                        rank: 1,
                        description: 'Muito relevante',
                    },
                    {
                        id: 2,
                        rank: 2,
                        description: 'Relevante',
                    },
                    {
                        id: 3,
                        rank: 3,
                        description: 'Pouco relevante',
                    }
                ],

                filter: {
                    description: '',
                    rank: null,
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
                        name: 'rank_id',
                        title: 'Rank'
                    },
                    {
                        name: 'deleted_at',
                        title: 'Activo'
                    }
                ],

                showExtraManagementModal: false,

                extraDto: null
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize'
            ]),

            isFetchingExtras () {
                return this.loadings.indexOf('configurations-fetching-fuel-types') >= 0
            },

            hasFilteredResults () {
                return !!(this.filter.description || this.filter.active !== null || this.filter.rank !== null)
            },

            searchPlaceholder () {
                let placeholder = [
                    'descrição'
                ].join(', ')

                return placeholder.charAt(0).toUpperCase() + placeholder.slice(1).toLowerCase()
            },

            isExtraManagementValid () {
                return !!(this.extraDto &&
                    this.extraDto.description)
            },

            extraManagementModalTitle () {
                if (!this.extraDto) {
                    return null
                }

                return this.extraDto.id
                    ? 'Editar extra'
                    : 'Novo extra'
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
                this.fetchExtras();
            },

            fetchExtras () {
                let self = this

                self.loadingAdd('configurations-fetching-extras')

                if(self.filter.rank) {
                    self.filter.rankId = self.filter.rank.id
                } else {
                    self.filter.rankId = null
                }

                let parameters = {
                    filter: self.filter,
                    pagination: self.pagination,
                    orderBy: self.orderBy,
                    method: 'retrieve'
                }

                return extrasService.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.extras = response.data.data.data
                        self.pagination.totalItems = response.data.data.total
                    } else {
                        // TODO
                    }

                    self.loadingRemove('configurations-fetching-extras')
                }).catch(exception => {
                    throw exception
                })
            },

            search (value) {
                this.filter.description = value

                this.fetchExtras()
            },

            order (orderBy) {
                this.orderBy = orderBy

                this.fetchExtras()
            },

            clearFilter () {
                this.filter.description = ''
                this.filter.rank = null
                this.filter.active = null

                this.fetchExtras()
            },

            openExtraManagement (extra) {
                let extraDto = {
                    id: null,
                    description: '',
                    rank: null,
                    active: true,
                }

                // Edit
                if (extra) {
                    Object.assign(extraDto, extra)

                    if (extra.rank_id) {
                        extraDto.rank = _.find(this.ranks, function(rank) {
                            return rank.id === extra.rank_id
                        })
                    }

                    if (extra.deleted_at) {
                        extraDto.active = false
                    }
                    // fetch models this.fetchChecklistItems(editingChecklists.id)
                }

                this.extraDto = extraDto
                this.showExtraManagementModal = true
            },

            closeExtraManagement () {
                this.showExtraManagementModal = false
                this.extraDto = null
            },

            save () {
                let self = this

                self.loadingAdd('configurations-saving-fuel-type')

                let parameters = {}
                let request = null

                if (self.extraDto.id) { // Edit
                    parameters = {
                        data: {
                            description: self.extraDto.description,
                            rankId: self.extraDto.rank ? self.extraDto.rank.id : self.ranks[ranks.lenght - 1].id,
                            active: self.extraDto.active
                        },
                        filter: {
                            id: self.extraDto.id
                        },
                        method: 'update'
                    }

                    request = extrasService.update(parameters)
                } else { // New
                    parameters = {
                        data: {
                            description: self.extraDto.description,
                            rankId: self.extraDto.rank ? self.extraDto.rank.id : self.ranks[ranks.lenght - 1].id,
                            active: self.extraDto.active
                        },
                        method: 'create'
                    }

                    request = extrasService.create(parameters)
                };

                return request.then(response => {
                    if (response.data.status === 'success') {
                        toastrService.success(
                            self.$i18n.t('general.success'),
                            self.$i18n.t('general.success-save'),
                            {positionClass: 'login-toast-top-right'}
                        )

                        self.fetchExtras()
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
                    self.closeExtraManagement()
                    self.loadingRemove('configurations-saving-fuel-type')
                })
            },

            getRankDescriptionById (rankId) {
                if (!rankId) {
                    return '--'
                }
                return _.find(this.ranks, function(rank) {
                    return rank.id === rankId
                }).description
            }
        },

        watch: {
            'filter.active' () {
                this.fetchExtras()
            }
        },

        created () {
            this.fetchExtras()
        }
    }

</script>

<style>
    .editing {
        background-color: ghostwhite !important;
    }

</style>
