import config from '@/core/config'
import { HubConnectionBuilder } from '@aspnet/signalr'

const SIGNALR_ENDPOINT = config.get('app.signalr.endpoint')

let binaryHubService = {
    connection: new HubConnectionBuilder().withUrl(SIGNALR_ENDPOINT + '/binary').build(),
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

export default binaryHubService
