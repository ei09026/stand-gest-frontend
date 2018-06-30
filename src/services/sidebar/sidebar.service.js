import requestService from '@/services/shared/request.service'
import config from '@/core/config'
import Vue from 'vue'

const API_URL = config.get('app.api.endpoints.backend') + '/api/v2'
const GET_MENUS = API_URL + '/menu/menus'
const CREATE_MENUS = API_URL + '/menu/menus'
const UPDATE_MENUS = API_URL + '/menu/menus'

let tokenSource = null

let logsService = {
    retrieve (filter = {slug: null, getAll: false}) {
        let cancelToken = Vue.axios.CancelToken

        tokenSource = cancelToken.source()
        
        return requestService.retrieve(GET_MENUS, filter, null, null, null, tokenSource)
    },

    create (data) {
        return requestService.create(CREATE_MENUS, data)
    },

    update (filter, data) {
        return requestService.update(UPDATE_MENUS, filter, data)
    }

}

export default logsService
