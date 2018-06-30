import config from '@/core/config'
import { HubConnectionBuilder } from '@aspnet/signalr'
import store from '@/vuex/store'
import toastrService from '@/services/shared/toastr.service'
import commandHub from '@/services/signalr/commandHub.service'
import binaryHub from '@/services/signalr/binaryHub.Service'
import statusHub from '@/services/signalr/statusHub.Service'
import {i18n} from '@/bootstrap/app.bootstrap'

const SIGNALR_ENDPOINT = config.get('app.signalr.endpoint')

let signalrService = {
    hubs: {
        command: commandHub,
        binary: binaryHub,
        status: statusHub
    },

    initialize () {
        setInterval(this.connectionHandler, 5000)
    },

    hubConnect (hub) {
        if (!hub.initialized) {
            hub.initialize()
        }
        
        if (hub.connection.connection.connectionState === 1 || hub.isConnecting === true) {
            return
        }

        console.log(`Connecting to hub ${hub.connection.connection.baseUrl}...`)

        hub.isConnecting = true

        hub.connection.start().then(() => {
            console.log(`Connected to hub ${hub.connection.connection.baseUrl}.`)
            hub.connection.invoke('Ping')
        }).catch(() => {
            hub.isConnecting = false
        })

        hub.connection.on("ReplyPing", data => {
            console.log(`Reply to ping from hub ${hub.connection.connection.baseUrl} ${data}.`)

            hub.isConnecting = false
            toastrService.info('', i18n.t('signalr.connected-to-server'))
            store.dispatch('hubConnected', hub.connection.connection.baseUrl)
        })

        hub.connection.onclose(() => {
            console.log(`Reply from hub ${hub.connection.connection.baseUrl}.`)

            toastrService.warning('', i18n.t('signalr.disconnected-from-server'))
            store.dispatch('hubDisconnected', hub.connection.connection.baseUrl)
        })
    },

    connectionHandler () {
        console.log("connectionHandler")
        
        Object.entries(signalrService.hubs).forEach(([key, value]) => {
            signalrService.hubConnect(value)
        })
    }

}

export default signalrService
