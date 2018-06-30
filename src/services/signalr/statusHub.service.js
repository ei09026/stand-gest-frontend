import config from '@/core/config'
import { HubConnectionBuilder } from '@aspnet/signalr'

const SIGNALR_ENDPOINT = config.get('app.signalr.endpoint')

let statusHubService = {
    connection: new HubConnectionBuilder().withUrl(SIGNALR_ENDPOINT + '/status').build(),
    isConnecting: false,
    eventsBinded: false,
    initialized: false,

    initialize () {
        this.initialized = true

        if (!this.eventsBinded) {
            this.bindEvents()
        }
    },

    bindEvents () {
        this.eventsBinded = true
    }
}

export default statusHubService
