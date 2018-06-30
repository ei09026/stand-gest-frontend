<template>
    <div class="sessions">
        <page-header
            :active-title="$i18n.tc('sessions.general.sessions', 2)"></page-header>

        <idt-table
            use-filter
            use-ordering
            clickable-rows
            :table-min-height="tableMinHeight"
            :columns="columns"
            column-key="name"
            column-label="title"
            :rows="sessionsData"
            row-key="id"
            :order-by="orderBy"
            :loading="isFetchingSessionsData"
            :pagination="pagination"
            :unorderable-columns="unorderableColumns"
            has-filtered-results
            @order="order"
            @row-clicked="goToSession"
            @filter="applyFilter"
            @refresh="applyFilter"
            @page-changed="goToPage"
            @filter-clear="clearFilter">

            <template slot="filter">
                <div class="row m-b-sm">
                    <div class="col-lg-3 m-b-sm">
                        <label>Motivo</label>

                        <multiselect
                            v-model="filter.sessionType"
                            :options="sessionTypes"
                            :searchable="true"
                            :multiple="false"
                            :no-results-label="$i18n.t('general.no-results')"
                            track-by="id"
                            label="description"></multiselect>
                    </div>

                    <div class="col-lg-3 m-b-sm">
                        <label>Estado</label>

                        <multiselect
                            v-model="filter.state"
                            :options="sessionSates"
                            :searchable="true"
                            :multiple="false"
                            :no-results-label="$i18n.t('general.no-results')"
                            track-by="id"
                            label="description"></multiselect>
                    </div>

                    <div class="col-lg-3 m-b-sm">
                        <div class="form-group m-b-none">
                            <label>Referência</label>

                            <input class="form-control"
                                v-model="filter.clientReference"
                                @keyup.enter="applyFilter">
                        </div>
                    </div>

                    <div class="col-lg-3 m-b-sm">
                        <label>Novo Cliente</label>

                        <div>
                            <div class="btn-group">
                                <radio-item
                                    button
                                    :val="null"
                                    v-model="filter.newClient">

                                    {{ $i18n.t('general.all') }}
                                </radio-item>

                                <radio-item class="m-l-sm"
                                    button
                                    :val="true"
                                    v-model="filter.newClient">

                                    <i class="fas fa-check"></i>

                                    Sim
                                </radio-item>

                                <radio-item class="m-l-sm"
                                    button
                                    :val="false"
                                    v-model="filter.newClient">

                                    <i class="fas fa-ban"></i>

                                    Não
                                </radio-item>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-6">
                        <label>Data de registo</label>

                        <div class="row">
                            <div class="col-lg-6">
                                <date-time-picker
                                    v-model="filter.date.begin"
                                    :placeholder="$i18n.t('general.begin')"
                                    :options="{position: 'bottom right'}"
                                    @input="applyFilter"></date-time-picker>
                            </div>

                            <div class="col-lg-6">
                                <date-time-picker
                                    v-model="filter.date.end"
                                    :placeholder="$i18n.t('general.end')"
                                    :options="{position: 'bottom right'}"
                                    @input="applyFilter"></date-time-picker>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-3 m-b-sm">
                        <div class="form-group m-b-none">
                            <label>Nº de registo</label>

                            <input class="form-control"
                                type="number"
                                v-model="filter.sessionId"
                                @keyup.enter="applyFilter">
                        </div>
                    </div>

                    <div class="col-lg-3 m-b-sm"
                        v-if="userColumnVisible">

                        <div class="form-group m-b-none">
                            <label>Utilizador</label>

                            <input class="form-control"
                                v-model="filter.user"
                                @keyup.enter="applyFilter">
                        </div>
                    </div>
                </div>
            </template>

            <template
                slot="cell"
                slot-scope="props">

                <template
                    v-if="props.column.name === 'createdAt'">

                    {{ formatDate(props.row) }}
                </template>

                <template
                    v-else-if="props.column.name === 'state'">

                    {{ stateTranslation(props.row) }}
                </template>

                <template
                    v-else-if="props.column.name === 'newClient'">

                    <i class="fa"
                        :class="{
                            'fa-check text-success': props.cell,
                            'fa-ban text-danger': !props.cell
                        }"></i>
                </template>

                <template
                    v-else-if="props.column.name === 'actions'">

                    <button class="btn btn-circle btn-success m-l-xs"
                        v-tooltip="{title: $i18n.t('sessions.general.goto-session')}"
                        @click.stop.prevent="goToSession(props.row)">

                        <i class="fas fa-eye"></i>
                    </button>

                    <button class="btn btn-circle btn-success m-l-xs"
                        v-tooltip="{title: $i18n.t('sessions.general.edit-session')}"
                        @click.stop.prevent="editSession(props.row)">

                        <i class="fas fa-pencil-alt"></i>
                    </button>
                </template>

                <template
                    v-else-if="props.column.name === 'userAvatar'">

                    <img alt="image"
                        :src="pictureSource(props.row)">
                </template>

                <template
                    v-else>

                    {{props.cell}}
                </template>
            </template>
        </idt-table>
    </div>
</template>

<script>
    import _ from 'lodash'
    import Multiselect from '@/components/shared/multi-select'
    import eventHub from '@/services/shared/events.service'
    import authService from '@/services/shared/auth.service'
    import alertService from '@/services/shared/alert.service'
    import requestService from '@/services/shared/request.service'
    import sessionsService from '@/services/sessions/session.service'
    import usersService from '@/services/users/users.service'
    import tooltip from '@/directives/tooltip'
    import PageHeader from '@/components/layout/PageHeader'
    import Loading from '@/components/shared/Loading'
    import Pagination from '@/components/shared/Pagination'
    import IdtTable from '@/components/shared/IdtTable/IdtTable'
    import dateTimeService from '@/services/shared/dateTime.service'
    import RadioItem from '@/components/shared/input/RadioItem'
    import DateTimePicker from '@/components/shared/input/DateTimePicker'
    import {mapGetters, mapActions} from 'vuex'

    let decimalRegex = RegExp('^[0-9]+(\.[0-9]+)?$')

    let loadingKeys = {
        fetchingSessions: 'fetching-sessions',
        fetchingSessionsDetails: 'fetching-sessions-details',
        fetchingSessionTypes: 'fetching-session-types',
        fetchingUsers: 'fetching-users'
    }

    export default {
        directives: {
            tooltip
        },

        components: {
            PageHeader,
            Loading,
            Pagination,
            IdtTable,
            RadioItem,
            Multiselect,
            DateTimePicker
        },

        data () {
            return {
                cancelToken: null,

                sessionSates: [],

                sessionsCancelToken: null,

                sessionTypes: [],

                sessions: [],

                sessionDetails: [],

                sessionsUser: [],

                userPictures: [],

                filter: {
                    ids: [],
                    newClient: null,
                    sessionType: null,
                    state: '',
                    clientReference: null,
                    date: {
                        begin: null,
                        end: null
                    },
                    externalUsersId: [],
                    user: null
                },

                finalFilter: null,

                pagination: {
                    itemsPerPage: 15,
                    page: 1,
                    totalItems: 0
                },

                orderBy: {
                    column: 'sessions.id',
                    direction: 'desc'
                },

                unorderableColumns: [
                    'actions',
                    'username',
                    'userAvatar'
                ],

                columns: [
                    {
                        name: 'id',
                        title: this.$i18n.t('sessions.general.id'),
                        thClass: 'text-right',
                        tdClass: 'text-right'
                    },
                    {
                        name: 'sessionTypeDescription',
                        title: 'Motivo',
                        thClass: 'text-left',
                        tdClass: 'text-left'
                    },
                    {
                        name: 'clientReference',
                        title: 'Referência',
                        thClass: 'text-left',
                        tdClass: 'text-left'
                    },
                    {
                        name: 'newClient',
                        title: 'Novo Cliente',
                        thClass: 'text-center',
                        tdClass: 'text-center'
                    },
                    {
                        name: 'createdAt',
                        title: this.$i18n.t('sessions.general.date'),
                        thClass: 'text-center',
                        tdClass: 'text-center'
                    },
                    {
                        name: 'state',
                        title: this.$i18n.t('sessions.general.state')
                    },

                    {
                        name: 'userAvatar',
                        tdClass: 'client-avatar'
                    },

                    {
                        name: 'username',
                        title: this.$i18n.tc('users.general.user')
                    },

                    {
                        name: 'actions',
                        title: this.$i18n.t('sessions.general.actions'),
                        thClass: 'text-center',
                        tdClass: 'text-center actions'
                    }
                ]
            }
        },

        computed: {
            ...mapGetters([
                'loadings',
                'pageContentSize'
            ]),

            isFetchingSessionsData () {
                return !!_.intersection(this.loadings, [
                    loadingKeys.fetchingSessions,
                    loadingKeys.fetchingSessionsDetails,
                    loadingKeys.fetchingSessionTypes
                ]).length
            },

            sessionsData () {
                let self = this

                let sessionsDataset = self.sessions || []

                _.forEach(self.sessions, session => {
                    let detail = _.find(self.sessionDetails, {sessionId: session.id})

                    if (!detail) {
                        return
                    }

                    session.clientReference = detail.clientReference
                    session.newClient = detail.newClient
                    session.updatedAt = detail.updatedAt

                    session.sessionTypeDescription = _.find(self.sessionTypes, {id: session.sessionTypeId}).description

                    let user = _.find(self.sessionsUser, {externalId: session.createdBy})

                    if (!_.isNil(user)) {
                        session.username = user.name
                    }
                })

                return sessionsDataset
            },

            userColumnVisible () {
                return authService.hasClaim('CRITICAL_OPERATIONS')
            },

            tableMinHeight () {
                return this.pageContentSize.height - 335
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove',
                'setSessionId',
                'startClientSession',
                'closeClientSession',
                'documentValidated',
                'clientReferenceCompleted',
                'checklistCompleted'
            ]),

            clearFilter () {
                this.filter.ids = []
                this.filter.newClient = null,
                this.filter.sessionType = null
                this.filter.state = null
                this.filter.clientReference = null
                this.filter.date.begin = null
                this.filter.date.end = null
                this.filter.externalUsersId = []
                this.filter.user = null

                this.applyFilter()
            },

            applyFilter () {
                let self = this

                self.pagination.page = 1

                let request = new Promise(resolve => {
                    return resolve(true)
                })

                self.finalFilter = Object.assign({}, self.filter)
                self.finalFilter.externalUsersId = []

                if (!_.isNil(self.filter.sessionType)) {
                    self.finalFilter.sessionTypeId = self.filter.sessionType.id
                }

                if (!_.isNil(self.filter.sessionId)) {
                    self.finalFilter.ids = [self.filter.sessionId]
                }

                if (!_.isNil(self.filter.state)) {
                    self.finalFilter.state = self.filter.state.state
                }

                if (self.filter.date.begin) {
                    self.finalFilter.date.begin = dateTimeService.fromLocalToServer(self.filter.date.begin)
                }

                if (self.filter.date.end) {
                    self.finalFilter.date.end = dateTimeService.fromLocalToServer(self.filter.date.end)
                }

                if (!authService.hasClaim('CRITICAL_OPERATIONS')) {
                    self.finalFilter.externalUsersId.push(authService.authUser.externalId)
                }

                if (!_.isEmpty(self.filter.user)) {
                    request = new Promise(resolve => {
                        self.fetchUsers({name: self.filter.user}, true).then((users) => {
                            if(!users.length) {
                                resolve(false)
                            } else {
                                _.forEach(users, user => {
                                    self.finalFilter.externalUsersId.push(user.externalId)
                                })

                                resolve(true)
                            }
                        })
                    })
                }

                request.then((result) => {
                    if (!result) {
                        this.sessions = []

                        return
                    }

                    self.fetchData()
                })
            },

            pictureSource (user) {
                let userPicture = this.userPictures.filter(userPicture => {
                    return userPicture.userExternalId === user.createdBy
                })

                if (!userPicture.length) {
                    return usersService.defaultAvatar
                }

                if (userPicture[0].internal) {
                    return 'data:image/png;base64,' + userPicture[0].picture
                }

                return userPicture[0].picture
            },

            stateTranslation (session) {
                return this.$i18n.t('sessions.states.' + session.state)
            },

            formatDate (session) {
                return dateTimeService.fromServerToLocalString(session.createdAt, 'dateTime')
            },

            fetchSessionStates () {
                let states = sessionsService.sessions.getStates()

                states.forEach((element) => {
                    element.description = this.$i18n.t('sessions.states.' + element.state)
                })

                this.sessionSates = states
            },

            fetchUsers (users, byName = false) {
                let self = this

                self.loadingAdd(loadingKeys.fetchingUsers)

                let parameters = {}

                if (!_.isNil(byName)) {
                    parameters.filter = {
                        name: users.name
                    }
                } else {
                    parameters.filter = {
                        externalIds: _.uniq(users.map(item => item.createdBy))
                    }
                }

                return usersService.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        let users = response.data.data.results

                        _.forEach(users, user => {
                            user.externalId = _.toUpper(user.externalId)
                        })

                        self.loadingRemove(loadingKeys.fetchingUsers)
                        return Promise.resolve(users)
                    } else {
                        self.loadingRemove(loadingKeys.fetchingUsers)
                        return Promise.reject(new Error(response.data.message))
                    }
                })
            },

            fetchSessions () {
                let self = this

                self.sessionsCancelToken = requestService.cancelToken.cancelAndCreate(self.sessionsCancelToken)

                self.loadingAdd(loadingKeys.fetchingSessions)

                let orderBy = Object.assign({}, self.orderBy)

                let parameters = {
                    cancelToken: self.sessionsCancelToken,
                    filter: self.finalFilter,
                    pagination: self.pagination,
                    orderBy
                }

                return sessionsService.sessions.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.loadingRemove(loadingKeys.fetchingSessions)

                        self.pagination.totalItems = response.data.data.totalItems

                        return Promise.resolve(response.data.data.results)
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }
                }).catch(exception => {
                    self.loadingRemove(loadingKeys.fetchingSessions)

                    if (!requestService.cancelToken.isCancel(exception)) {
                        throw exception
                    }
                })
            },

            fetchUserPicture (userExternalId) {
                var self = this

                usersService.getUserPicture(userExternalId).then((response) => {
                    if (response.data.status === 'success') {

                        let insertPicture = _.findIndex(self.userPictures, (data) => {
                            return data.userExternalId === userExternalId
                        }) === -1

                        if (insertPicture) {
                            self.userPictures.push({
                                userExternalId: userExternalId,
                                picture: response.data.data.internal
                                    ? response.data.data.pictureInternal.data
                                    : response.data.data.pictureExternal,
                                internal: response.data.data.internal
                            })
                        }
                    }
                })
            },

            fetchSessionDetails (sessions) {
                let self = this

                self.loadingAdd(loadingKeys.fetchingSessionsDetails)

                let parameters = {
                    filter: {
                        sessionIds: sessions.map(item => item.id)
                    }
                }

                return sessionsService.details.retrieve(parameters).then(response => {
                    if (response.data.status === 'success') {
                        self.loadingRemove(loadingKeys.fetchingSessionsDetails)
                        return Promise.resolve(response.data.data.results)
                    } else {
                        self.loadingRemove(loadingKeys.fetchingSessionsDetails)
                        return Promise.reject(new Error(response.data.message))
                    }
                })
            },

            fetchSessionTypes () {
                let self = this

                self.loadingAdd(loadingKeys.fetchingSessionTypes)

                return sessionsService.sessionTypes.retrieve({}).then(response => {
                    if (response.data.status === 'success') {
                        self.loadingRemove(loadingKeys.fetchingSessionTypes)
                        return Promise.resolve(response.data.data.results)
                    } else {
                        self.loadingRemove(loadingKeys.fetchingSessionTypes)
                        return Promise.reject(new Error(response.data.message))
                    }
                })
            },

            order (orderBy) {
                this.orderBy = orderBy

                this.fetchData()
            },

            goToPage (page) {
                this.pagination.page = page

                this.fetchData()
            },

            goToSession (session) {
                this.setSessionId(session.id)

                switch(session.state) {
                    case sessionsService.sessions.states.FINALIZED:
                        this.closeClientSession()
                        this.$router.push('/sessions/' + session.id)
                        break
                    case sessionsService.sessions.states.REOPENED:
                        this.$router.push('/edit-session/' + session.id)
                        break
                    case sessionsService.sessions.states.ONGOING:
                        this.startClientSession()
                        this.$router.push('/new-session/')
                        break
                }
            },

            editSession (session) {
                let parameters = {
                    filter: {
                        ids: [session.id]
                    },
                    data: {
                        fields: {
                            state: sessionsService.sessions.states.REOPENED
                        }
                    }
                }

                sessionsService.sessions.update(parameters).then(response => {
                    if (response.data.status === 'success') {
                        this.setSessionId(session.id)

                        this.$nextTick(() => {
                            this.$router.push('/edit-session/' + session.id)
                        })
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }
                })
            },

            fetchData () {
                let self = this

                // clear context
                this.setSessionId(null)
                this.closeClientSession()
                this.documentValidated(false)
                this.clientReferenceCompleted(false)
                this.checklistCompleted(false)

                this.fetchSessionStates()

                this.fetchSessionTypes().then((sessionTypes) => {
                    self.sessionTypes = sessionTypes
                })

                this.fetchSessions().then((sessions) => {
                    self.sessions = sessions

                    if (!_.isNil(sessions) && sessions.length > 0) {
                        this.fetchSessionDetails(sessions).then((sessionDetails) => {
                            self.sessionDetails = sessionDetails
                        })

                        this.fetchUsers(sessions).then((users) => {
                            self.sessionsUser = users

                            _.forEach(users, user => {
                                self.fetchUserPicture(user.externalId)
                            })
                        })
                    }
                })
            }
        },

        created () {
            eventHub.$on('refresh-session-list', this.applyFilter)
            this.cancelToken = requestService.cancelToken.create()
            this.sessionsCancelToken = requestService.cancelToken.create()

            this.applyFilter()
        },

        beforeDestroy () {
            eventHub.$off('refresh-session-list', this.applyFilter)

            this.cancelToken = requestService.cancelToken.cancelAndCreate(this.cancelToken)
            this.sessionsCancelToken = requestService.cancelToken.cancelAndCreate(this.sessionsCancelToken)
        }
    }
</script>

<style>
    .sessions .idt-table td.actions,
    .sessions .idt-table td.client-avatar {
        padding-top: 2px;
        padding-bottom: 0px;
        white-space: nowrap;
    }

    .sessions .production-items tbody>tr>td.state {
        margin-top: 32px;
        vertical-align: middle;
    }
</style>
