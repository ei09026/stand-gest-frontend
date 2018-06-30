import config from '@/core/config'
import Vue from 'vue'

const AUTH_API_URL = config.get('app.api.endpoints.auth') + '/api/v1'

const HEADERS = {
    headers: {
        'X-2Auth-Domain-Id': config.get('app.api.idt2auth_domain_id'),
        'X-2Auth-Client-Id': config.get('app.api.idt2auth_client_id')
    }
}

let tenantsService = {
    // TODO: should be 'getTenants'
    getAllTenants () {
        let route = AUTH_API_URL + '/context/clients/' +
            config.get('app.api.idt2auth_client_id') + '/tenants'

        return Vue.axios.get(route, HEADERS)
    },

    // TODO: should be in users service 'getTenants'
    getTenants (userId) {
        let route = AUTH_API_URL + '/context/clients/' +
            config.get('app.api.idt2auth_client_id') +
            '/users/' + userId + '/tenants'

        return Vue.axios.get(route, HEADERS)
    },

    getTenant (tenantId) {
        return Vue.axios.get(AUTH_API_URL + '/context/tenants/' + tenantId, HEADERS)
    },

    createTenant (data) {
        return Vue.axios.post(AUTH_API_URL + '/context/clients/' + config.get('app.api.idt2auth_client_id') + '/create-tenant', data, HEADERS)
    },

    updateTenant (tenantId, data) {
        return Vue.axios.put(AUTH_API_URL + '/context/tenants/' + tenantId, data, HEADERS)
    },

    accessRestrictions: {
        setIpCheck (tenantId, status) {
            return Vue.axios.post(AUTH_API_URL + '/context/tenants/' + tenantId + '/set-ip-check', {ipCheck: status}, HEADERS)
        },

        getIps (tenantId) {
            return Vue.axios.get(AUTH_API_URL + '/context/tenants/' + tenantId + '/ip-restrictions', HEADERS)
        },

        setIps (tenantId, ips) {
            return Vue.axios.post(AUTH_API_URL + '/context/tenants/' + tenantId + '/ip-restrictions', {ips}, HEADERS)
        }
    }

}

export default tenantsService
