import config from '@/core/config'
import Vue from 'vue'

const AUTH_API_URL = config.get('app.api.endpoints.auth') + '/api/v1'

const OPTIONS = {
    headers: {
        'X-2Auth-Domain-Id': config.get('app.api.idt2auth_domain_id'),
        'X-2Auth-Client-Id': config.get('app.api.idt2auth_client_id')
    }
}

const CLIENT_ID = config.get('app.api.idt2auth_client_id')

let clientService = {
    get () {
        let route = AUTH_API_URL + '/context/clients/' + CLIENT_ID

        return Vue.axios.get(route, OPTIONS)
    },

    accessRestrictions: {
        setIpCheck (status) {
            let route = AUTH_API_URL +
                '/context/clients/' + CLIENT_ID +
                '/set-ip-check'

            return Vue.axios.post(route, {ipCheck: status}, OPTIONS)
        }
    },

    authorization: {
        getRoles () {
            let route = AUTH_API_URL +
                '/context/clients/' + CLIENT_ID +
                '/roles'

            return Vue.axios.get(route, OPTIONS)
        },

        createRole (role) {
            let route = AUTH_API_URL + '/authorization/roles/create'

            let data = {
                clientId: CLIENT_ID,
                description: role.description
            }

            return Vue.axios.post(route, data, OPTIONS)
        },

        updateRole (role) {
            let route = AUTH_API_URL + '/authorization/roles/' + role.id + '/update'

            return Vue.axios.post(route, {description: role.description}, OPTIONS)
        },

        deleteRole (role) {
            let route = AUTH_API_URL + '/authorization/roles/' + role.id + '/delete'
            
            return Vue.axios.post(route, {}, OPTIONS)
        },

        getClaims () {
            let route = AUTH_API_URL +
                '/context/clients/' + CLIENT_ID +
                '/claims'

            return Vue.axios.get(route, OPTIONS)
        },

        getClaimGroups () {
            let route = AUTH_API_URL +
                '/context/clients/' + CLIENT_ID +
                '/claim-groups'

            return Vue.axios.get(route, OPTIONS)
        },

        getTenantRoles (tenantId) {
            let route = AUTH_API_URL +
                '/context/clients/' + CLIENT_ID +
                '/tenants/' + tenantId +
                '/roles'

            return Vue.axios.get(route, OPTIONS)
        },

        addClaimToRole (roleId, claimId, tenantId) {
            let route = AUTH_API_URL +
            '/authorization/roles/' + roleId +
            '/add-claim'

            return Vue.axios.post(route, {claimId, tenantId}, OPTIONS)
        },

        removeClaimFromRole (roleId, claimId, tenantId) {
            let route = AUTH_API_URL +
            '/authorization/roles/' + roleId +
            '/remove-claim'

            return Vue.axios.post(route, {claimId, tenantId}, OPTIONS)
        }
    }
}

export default clientService
