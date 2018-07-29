import Vue from 'vue'

// import Vue from 'vue'
import config from '@/core/config'

/*eslint-disable */
const API_URL = config.get('app.api.endpoints.backend')
/*eslint-enable */


let authService = {
    authUser: null,
    tenant: {},

    check () {
        return !!this.authUser
    },

    revokePasswordCheck () {
        return !!this.authUser.revokePassword
    },

    saveSession (token, authUser) {
        localStorage.setItem('token', token)

        this.authUser = authUser
    },

    getToken () {
        return localStorage.getItem('token')
    },

    login (credentials) {
        return Vue.axios.get(API_URL + '/api/v1/authentication/authenticate', 
            {
                headers: {'Content-Type': 'application/json'}, 
                params: credentials
            }
        )
    },

    changePassword (payload) {
        return new Promise((resolve) => {
            idt2auth.changePassword(payload.fields.currentPassword, payload.fields.newPassword, (error, response) => {
                resolve(error || response)
            })
        })
    },

    logout () {
        localStorage.removeItem('token')
    }
}

export default authService
