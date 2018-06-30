<template>
    <nav class="navbar navbar-fixed-top" role="navigation"
        :class="{'no-side-menu': !pageHasSideMenu}">

        <div class="navbar-header">
            <div class="navbar-controls">
                <button class="btn btn-circle m-r-sm home"
                    @click="goHome"
                    v-tooltip="{title: $t('navigation.home'), placement: 'bottom'}">
                    
                    <i class="fa fa-home"></i>
                </button>
                
                <img
                    :src="'/static/assets/logo_MOZA.png'">
            </div>
        </div>

        <ul class="nav navbar-top-links navbar-right">
            <li
                v-if="startSessionVisible">

                <a href="#"
                    :class="{
                        'disabled-link' : !canConnect
                    }"
                    @click.prevent="startSession()">

                    <i class="fas fa-rss"></i>

                    {{ $t('authentication.start-session') }}
                </a>
            </li>

            <li
                v-if="finalizeReopenSessionVisible">

                <a href="#"
                    :class="{
                        'disabled-link': !finalizeReopenSessionVisible
                    }"
                    @click.prevent="finalizeReopenedSession()">

                    <i class="fas fa-rss"></i>

                    {{ $t('authentication.finalize-reopen-session') }}
                </a>
            </li>

            <li
                v-if="clientSessionStarted && validationErrors.length === 0">

                <a href="#"
                    :class="{
                        'disabled-link': !canCloseSession
                    }" @click.prevent="closeSession()">

                    <i class="fas fa-rss"></i>

                    {{ $t('authentication.end-session') }}
                </a>
            </li>

            <li
                v-if="clientSessionStarted && validationErrors.length > 0"
                    v-tooltip="invalidReasonsTooltip">

                <a href="#"
                    :class="{
                        'disabled-link': !canCloseSession
                    }">

                    <i class="fas fa-rss"></i>

                    {{ $t('authentication.end-session') }}

                    <i class="fa fa-exclamation-triangle"></i>
                </a>
            </li>

            <li>
                <a href="#"
                    :class="{'disabled-link': clientSessionStarted}"
                    v-if="tenant != null"
                    @click.prevent="logout()">

                    <i class="fa fa-sign-out-alt"></i>

                    {{ $t('authentication.logout') }}
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
    import authService from '@/services/shared/auth.service'
    import sessionsService from '@/services/sessions/session.service'
    import alertService from '@/services/shared/alert.service'
    import siganlR from '@/services/signalr/signalr.service'
    import eventHub from '@/services/shared/events.service'
    import toastrService from '@/services/shared/toastr.service'
    import tooltip from '@/directives/tooltip'
    import {mapGetters, mapActions} from 'vuex'
    import _ from 'lodash'

    export default {
        directives: {
            tooltip
        },

        data () {
            return {
                tenant: null,
                commandHub: siganlR.hubs.command,
                editSession: false
            }
        },

        computed: {
            ...mapGetters([
                'pageHasSideMenu',
                'isHubConnected',
                'clientSessionStarted',
                'getSessionId',
                'isChecklistCompleted',
                'isClientReferenceCompleted',
                'isDocumentValidated'
            ]),

            canConnect () {
                return this.isHubConnected(this.commandHub.connection.connection.baseUrl)
            },

            startSessionVisible () {
                return !this.clientSessionStarted && !this.editSession
            },

            finalizeReopenSessionVisible () {
                return this.editSession && !this.clientSessionStarted
            },

            canCloseSession () {
                return this.validationErrors.length === 0 && this.canConnect
            },

            invalidReasonsTooltip () {
                let tooltip = ''

                for (let i = 0; i < this.validationErrors.length; i++) {
                    tooltip += '- ' + this.validationErrors[i] + '<br>'
                }

                return {
                    title: tooltip || null,
                    placement:'bottom',
                    html: true
                }
            },

            validationErrors () {
                var errors = []

                if (!this.isChecklistCompleted) {
                    errors.push('Checklist incompleta')
                }

                if (!this.isClientReferenceCompleted) {
                    errors.push('Referência de cliente em falta')
                }
                
                if (!this.isDocumentValidated) {
                    errors.push('Documento não validado pelo cliente')
                }

                return errors
            }
        },

        methods: {
            ...mapActions([
                'setSessionId'
            ]),

            logout () {
                let self = this

                alertService.advanced({
                    title: self.$i18n.t('authentication.are-you-sure-logout'),
                    type: 'warning',
                    showCancelButton: true
                }).then(() => {
                    authService.logout()
                    self.$router.push('/login')
                }).catch(alertService.noop)
            },

            startSession () {
                console.log('startSession')

                this.commandHub.connection.invoke('StartSession')
            },

            closeSession () {
                var self = this

                let parameters = {
                    filter: {
                        ids: [self.getSessionId]
                    },
                    data: {
                        fields: {
                            state: sessionsService.sessions.states.FINALIZED
                        }
                    }
                }

                sessionsService.sessions.update(parameters).then(response => {
                    if (response.data.status === 'success') {
                        eventHub.$emit('save-session-details', this.getSessionId)

                        self.setSessionId(null)
                        eventHub.$emit('refresh-session-list')

                        self.commandHub.connection.invoke('CloseSession')
                        self.$router.push('/sessions/')
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }
                })
            },

            finalizeReopenedSession () {
                let parameters = {
                    filter: {
                        ids: [this.getSessionId]
                    },
                    data: {
                        fields: {
                            state: sessionsService.sessions.states.FINALIZED
                        }
                    }
                }

                sessionsService.sessions.update(parameters).then(response => {
                    if (response.data.status === 'success') {
                        eventHub.$emit('save-session-details', this.getSessionId)
                        
                        this.setSessionId(null)

                        eventHub.$emit('refresh-session-list')
                        this.$router.push('/sessions/')
                    } else {
                        return Promise.reject(new Error(response.data.message))
                    }
                })
            },

            bindCommandHubEvents () {
            },

            clientSessionClosed () {
                toastrService.info('', this.$i18n.t('sessions.general.client-session-closed'))
            },

            goHome () {
                this.$router.push('/sessions')
            }
        },

        watch: {
            clientSessionStarted (newValue, oldValue) {
                if (!_.isNil(newValue) && this.clientSessionStarted) {
                    this.$router.push('/new-session/')
                }
            },

            '$route' (to, from) {
                if (to.path.startsWith('/edit-session/')) {
                    this.editSession = true
                } else {
                    this.editSession = false
                }
            }
        },

        created () {
            this.tenant = authService.getTenant()

            // this.commandHub.checkOnGoingSession()

            this.bindCommandHubEvents()

            eventHub.$on('client-session-closed', this.clientSessionClosed)
        },


        beforeDestroy () {
            eventHub.$off('client-session-closed', this.clientSessionClosed)
        },
    }

</script>

<style>
    .navbar {
        background-color: #C72A26;
        color: aliceblue;
    }

    .navbar-header {
        margin-left: 20px;
    }
    
    .nav.navbar-top-links a {
        color: aliceblue !important;
        font-size: 14px;
    }

    .disabled-link {
        cursor: not-allowed;
        opacity: 0.5;

    }

</style>