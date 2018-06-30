import config from '@/core/config'
import eventHub from '@/services/shared/events.service'
import { HubConnectionBuilder } from '@aspnet/signalr'
import store from '@/vuex/store'
import toastrService from '@/services/shared/toastr.service'
import sessionsService from '@/services/sessions/session.service'
import authService from '@/services/shared/auth.service'

const SIGNALR_ENDPOINT = config.get('app.signalr.endpoint')

let commandHubService = {
    connection: new HubConnectionBuilder().withUrl(SIGNALR_ENDPOINT + '/command').build(),
    isConnecting: false,
    eventsBinded: false,
    initialized: false,
    refreshHandlerStarted: false,

    initialize () {
        this.initialized = true

        if (!this.eventsBinded) {
            this.bindEvents()
        }

        if (!this.refreshHandlerStarted) {
            setInterval(this.refreshHandler, 10000)

            console.log(this)

            this.refreshHandler()

            this.refreshHandlerStarted = true
        }
    },

    bindEvents () {
        this.connection.on('ReplyStartSession', data => {
            console.log('Session started successfully.')

            let parameters = {
                data: {
                    sessionTypeId: sessionsService.sessionTypes.defaultSessionType(),
                    state: sessionsService.sessions.states.ONGOING
                }
            }

            sessionsService.sessions.create(parameters).then(response => {
                if (response.data.status === 'success') {
                    store.dispatch('startClientSession')
                    store.dispatch('setSessionId', response.data.data.id)
                } else {
                    return Promise.reject(new Error(response.data.message))
                }
            })

            toastrService.info('', 'Sessão iniciada com sucesso.')
        })

        this.connection.on('ReplyCloseSession', data => {
            console.log('Session ended successfully.')

            store.dispatch('closeClientSession')

            // let parameters = {
            //     filter: {
            //         ids: [store.getters.getSessionId]
            //     },
            //     data: {
            //         fields: {
            //             state: sessionsService.sessions.states.FINALIZED
            //         }
            //     }
            // }

            // sessionsService.sessions.update(parameters).then(response => {
            //     if (response.data.status === 'success') {
            //         store.dispatch('setSessionId', null)
            //         eventHub.$emit('refresh-session-list')
            //     } else {
            //         return Promise.reject(new Error(response.data.message))
            //     }
            // })

            toastrService.info('', 'Sessão concluida com sucesso.')
        })

        this.connection.on('CloseSession', data => {
            console.log('Session closed successfully.')

            // store.dispatch('closeClientSession')

            // let parameters = {
            //     filter: {
            //         ids: [store.getters.getSessionId]
            //     },
            //     data: {
            //         fields: {
            //             state: sessionsService.sessions.states.FINALIZED
            //         }
            //     }
            // }

            // sessionsService.sessions.update(parameters).then(response => {
            //     if (response.data.status === 'success') {
            //         store.dispatch('setSessionId', null)
            //         eventHub.$emit('client-session-closed')
            //         let message = {
            //             action: 'operator-session-closed'
            //         }
            //         this.connection.invoke('ReplyCloseSession', message)
            //     } else {
            //         return Promise.reject(new Error(response.data.message))
            //     }
            // })

            let message = {
                action: 'client-session-closed-ack'
            }
            this.connection.invoke('ReplyCloseSession', message)

            toastrService.info('', 'Cliente concluiu a sessão com sucesso.')
        })

        this.connection.on('DocumentValidated', data => {
            eventHub.$emit('document-validated')
        })

        this.eventsBinded = true
    },

    startSession () {
        this.connection.invoke('StartSession')
    },

    closeSession () {
        this.connection.invoke('CloseSession')
    },

    checkOnGoingSession () {
        let self = this

        let parameters = {
            filter: {
                externalUsersId: [authService.authUser.externalId],
                state: sessionsService.sessions.states.ONGOING
            }
        }

        sessionsService.sessions.retrieve(parameters).then(response => {
            if (response.data.status === 'success') {
                if (response.data.data.totalItems === 1) {
                    store.dispatch('setSessionId', response.data.data.results[0].id)
                    store.dispatch('startClientSession')
                }
            } else {
                return Promise.reject(new Error(response.data.message))
            }
        })
    },

    refreshHandler () {
        if (store.state.context.session.clientSessionStarted) {
            console.log('Refresh Hanlder')

            commandHubService.connection.invoke('RefreshSession')
        }
    }
}

export default commandHubService
