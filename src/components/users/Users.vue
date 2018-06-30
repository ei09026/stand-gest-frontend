<template>
    <div class="users">
        <page-header
            :active-title="$i18n.tc('users.general.user', 2)"></page-header>

        <maintenance
            v-if="tenants"
            :show="showNewUserModal"
            :tenants="tenants"
            @saved="saved($event)"
            @canceled="showNewUserModal = false"></maintenance>

        <filter-panel
            :show="showFilter"
            :filtered-results="!emptyFilter"
            @toggled="filterToggled"
            @filter="applyFilter"
            @clear="clearFilter">

            <div class="row">
                <div class="col-lg-4">
                    <div class="form-group m-b-none">
                        <label
                            v-text="$i18n.t('users.general.name')"></label>

                        <input class="form-control"
                            v-model="filter.name"
                            @keyup.enter="applyFilter">
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="form-group m-b-none">
                        <label
                            v-text="$i18n.t('users.general.email')"></label>

                        <input class="form-control"
                            v-model="filter.email"
                            @keyup.enter="applyFilter">
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="form-group m-b-none">
                        <label
                            v-text="$i18n.t('users.general.username')"></label>

                        <input class="form-control"
                            v-model="filter.username"
                            @keyup.enter="applyFilter">
                    </div>
                </div>
            </div>

            <div class="row m-t-md">
                <div class="col-lg-8">
                    <label
                        v-text="$i18n.t('users.general.last-login')"></label>

                    <div class="row">
                        <div class="col-lg-6">
                            <date-time-picker
                                v-model="filter.lastLogin.begin"
                                :placeholder="$i18n.t('general.begin')"
                                :options="{position: 'bottom right'}"
                                @input="applyFilter"></date-time-picker>
                        </div>

                        <div class="col-lg-6">
                            <date-time-picker
                                v-model="filter.lastLogin.end"
                                :placeholder="$i18n.t('general.end')"
                                :options="{position: 'bottom right'}"
                                @input="applyFilter"></date-time-picker>
                        </div>
                    </div>
                </div>

                <!--<div class="col-lg-3">
                    <div class="form-group m-b-none">
                        <label
                            v-text="$i18n.t('users.general.last-login')"></label>
                        <input class="form-control"
                            v-model="filter.email"
                            @keyup.enter="applyFilter">
                    </div>
                </div>-->
            </div>
        </filter-panel>

        <div class="ibox m-t-xs m-b-none"
            :class="{'no-action': !isAdministrator}">

            <div class="ibox-content no-paddings">
                <loading
                    v-if="isFetchingUsers"></loading>

                <div class="table-responsive"
                    :style="tableContainerStyle"
                    v-if="!isFetchingUsers">

                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th></th>

                                <th
                                    v-text="$i18n.t('users.general.name')"></th>

                                <th></th>

                                <th colspan="2"
                                    v-text="$i18n.t('users.general.email')"></th>

                                <th
                                    v-text="$i18n.t('users.general.username')"></th>

                                <th
                                    v-text="$i18n.t('users.general.last-login')"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="user in users"
                                :key="user.id"
                                @click="goToUser(user)">

                                <td class="client-avatar">
                                    <img alt="image"
                                        :src="pictureSource(user)">
                                </td>

                                <td>
                                    <span style="font-weight: 600;"
                                        v-text="user.name"></span>
                                </td>

                                <td>
                                    <i class="fa fa-ban text-danger"
                                        v-show="user.blocked"></i>
                                </td>

                                <td class="contact-type"><i class="fa fa-envelope"></i></td>

                                <td
                                    v-text="user.email"></td>

                                <td
                                    v-text="user.username"></td>

                                <td class="client-status">
                                    <span
                                        :class="{'font-italic': !user.lastLogin}"
                                        v-text="user.lastLogin ? dateTimeService.fromServerToLocalString(user.lastLogin, 'dateTime') : $t('general.never')"></span>
                                </td>
                            </tr>

                            <tr
                                v-show="!users.length">

                                <td colspan="8" class="text-muted font-italic no-results"
                                    v-text="$i18n.t('general.no-results')"></td>
                            </tr>
                        </tbody>
                    </table>

                    <pagination
                        v-if="users.length"
                        :pagination-class="['pull-right']"
                        :page="pagination.page"
                        :total-items="pagination.totalItems"
                        :items-per-page="pagination.itemsPerPage"
                        @pageChanged="goToPage($event)"></pagination>
                </div>
            </div>
        </div>

        <button-bar
            v-if="isAdministrator">

            <button class="btn btn-primary btn-circle btn-outline m-l-sm"
                v-tooltip="{title: $t('users.maintenance.new-user')}"
                @click="showNewUserModal = true">

                <i class="fa fa-plus"></i>
            </button>
        </button-bar>
    </div>
</template>

<script>
    import _ from 'lodash'
    import dateTimeService from '@/services/shared/dateTime.service'
    import usersService from '@/services/users/users.service'
    import tenantsService from '@/services/tenants/tenants.service'
    import authService from '@/services/shared/auth.service'
    import {mapGetters, mapActions} from 'vuex'
    import tooltip from '@/directives/tooltip'
    import PageHeader from '@/components/layout/PageHeader'
    import ButtonBar from '@/components/shared/ButtonBar'
    import Loading from '@/components/shared/Loading'
    import Toolbar from '@/components/shared/Toolbar'
    import FilterPanel from '@/components/shared/FilterPanel'
    import Pagination from '@/components/shared/Pagination'
    import Maintenance from '@/components/users/Maintenance'
    import DateTimePicker from '@/components/shared/input/DateTimePicker'
    import Multiselect from '@/components/shared/multi-select'

    export default {
        directives: {
            tooltip
        },

        components: {
            PageHeader,
            ButtonBar,
            Loading,
            Toolbar,
            FilterPanel,
            Pagination,
            Maintenance,
            DateTimePicker,
            Multiselect
        },

        data () {
            return {
                dateTimeService,

                users: [],

                tenants: [],

                userPictures: [],

                showFilter: false,

                filter: {
                    name: '',
                    email: '',
                    username: '',
                    lastLogin: {
                        begin: null,
                        end: null
                    },
                    tenant: null
                },

                pagination: {
                    itemsPerPage: 15,
                    page: 1,
                    totalItems: 0
                },

                showNewUserModal: false
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize',
                'pageButtonBarHeight'
            ]),

            isAdministrator () {
                return authService.hasClaim('CRITICAL_OPERATIONS')
            },

            isFetchingUsers () {
                return this.loadings.indexOf('fetchingUsers') !== -1
            },

            isLoadingCashDesks () {
                return this.loadings.indexOf('fetching-tenants') !== -1
            },

            finalFilter () {
                let finalFilter = _.pickBy(_.cloneDeep(this.filter), (property, key) => {
                    if (key === 'lastLogin') {
                        return property.begin || property.end
                    }

                    return !!property
                })

                if (finalFilter.lastLogin) {
                    if (finalFilter.lastLogin.begin) {
                        finalFilter.lastLogin.begin = finalFilter.lastLogin.begin.toJSON()
                    }

                    if (finalFilter.lastLogin.end) {
                        finalFilter.lastLogin.end = finalFilter.lastLogin.end.toJSON()
                    }
                }

                if (finalFilter.lastLogin) {
                    if (finalFilter.lastLogin.begin) {
                        finalFilter.lastLogin.begin = dateTimeService.fromLocalToServer(finalFilter.lastLogin.begin, 'dateTime')
                    }

                    if (finalFilter.lastLogin.end) {
                        finalFilter.lastLogin.end = dateTimeService.fromLocalToServer(finalFilter.lastLogin.end, 'dateTime')
                    }
                }

                if (finalFilter.tenant) {
                    finalFilter.tenantId = finalFilter.tenant.id
                    delete finalFilter.tenant
                }

                return _.isEmpty(finalFilter) ? null : finalFilter
            },

            emptyFilter () {
                return !this.finalFilter
            },

            tableContainerStyle () {
                return {
                    minHeight: (this.pageContentSize.height - this.pageButtonBarHeight - 285) + 'px'
                }
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            pictureSource (user) {
                let userPicture = this.userPictures.filter(userPicture => {
                    return userPicture.userExternalId === user.externalId
                })

                if (!userPicture.length) {
                    return usersService.defaultAvatar
                }

                if (userPicture[0].internal) {
                    return 'data:image/png;base64,' + userPicture[0].picture
                }

                return userPicture[0].picture
            },

            fetchTenantRelations (user) {
                let self = this

                return tenantsService.getTenants(user.externalId).then(response => {
                    user.tenants = response.data.data
                })
            },

            fetchUsers () {
                var self = this

                self.loadingAdd('fetchingUsers')

                var data = {
                    filter: self.finalFilter,
                    pagination: self.pagination,
                    orderBy: null,
                    relations: ['username']
                }

                usersService.retrieve(data).then(response => {
                    if (response.data.status === 'success') {
                        let users = _.cloneDeep(response.data.data.results)

                        _.forEach(users, user => {
                            user.tenants = []
                        })

                        self.users = users

                        self.pagination.totalItems = response.data.data.totalItems

                        _.forEach(self.users, user => {
                            self.fetchUserPicture(user.externalId)
                            self.fetchTenantRelations(user)
                        })
                    } else {
                        // TODO
                    }
                }).catch((response) => {
                    if (response.status) {
                        // ERROR
                    }
                }).then(() => {
                    self.loadingRemove('fetchingUsers')
                })
            },

            fetchUserPicture (userExternalId) {
                var self = this

                usersService.getUserPicture(userExternalId).then((response) => {
                    if (response.data.status === 'success') {
                        self.userPictures.push({
                            userExternalId: userExternalId,
                            picture: response.data.data.internal
                                ? response.data.data.pictureInternal.data
                                : response.data.data.pictureExternal,
                            internal: response.data.data.internal
                        })
                    }
                })
            },

            filterToggled (show) {
                this.showFilter = show
            },

            applyFilter () {
                this.pagination.page = 1
                this.fetchUsers()
            },

            clearFilter () {
                this.filter.name = ''
                this.filter.email = ''
                this.filter.username = ''
                this.filter.lastLogin.begin = null
                this.filter.lastLogin.end = null

                this.fetchUsers()
            },

            goToPage (page) {
                this.pagination.page = page
                this.fetchUsers()
            },

            goToUser (user) {
                if (!this.isAdministrator) {
                    return
                }

                this.$router.push('/users/' + user.id)
            },

            saved (user) {
                this.showNewUserModal = false
                this.goToUser(user)
            },

            fetchTenants () {
                let self = this

                self.loadingAdd('fetching-tenants')

                return tenantsService.getAllTenants().then(response => {
                    self.tenants = response.data.data.Tenants

                    self.loadingRemove('fetching-tenants')
                })
            }
        },

        created () {
            this.fetchTenants()
            this.fetchUsers()
        }
    }
</script>

<style>
    .users .table>tbody>tr>td:not(.no-results) {
        vertical-align: middle !important;
        cursor: pointer;
    }

    .users .table>tbody>tr>td.client-avatar {
        padding-top: 2px;
        padding-bottom: 0px;
    }

    .users.no-action .table>tbody>tr>td {
        cursor: default;
    }

    .users.no-action .table>tbody>tr:hover {
        background-color: inherit;
    }

    .users.no-action .table>tbody>tr:nth-of-type(odd):hover {
        background-color: #f9f9f9;
    }
</style>
