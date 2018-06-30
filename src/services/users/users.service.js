import config from '@/core/config'
import Vue from 'vue'
import routingUtility from '@/utilities/shared/routing'
import requestService from '@/services/shared/request.service'

const AUTH_ENDPOINT = config.get('app.api.endpoints.auth')
const API_V1_URL = AUTH_ENDPOINT + '/api/v1'
const API_V2_URL = AUTH_ENDPOINT + '/api/v2'

const DOMAIN_ID = config.get('app.api.idt2auth_domain_id')
const CLIENT_ID = config.get('app.api.idt2auth_client_id')

// API v1 options
const OPTIONS = {
    headers: {
        'X-2Auth-Domain-Id': DOMAIN_ID,
        'X-2Auth-Client-Id': CLIENT_ID
    }
}

const BACKEND_API_V1_URL = config.get('app.api.endpoints.backend') + '/api/v1'

let usersService = {
    defaultAvatar: 'static/assets/avatar.jpg', //routingUtility.buildPath('static/assets/avatar.jpg'),

    // API v2

    retrieve (parameters) {
        return requestService.retrieve(API_V2_URL + '/profile/users/', parameters)
    },

    queryTenantMedatada (parameters) {
        return requestService.retrieve(API_V2_URL + '/profile/users/query-tenant-metadata', parameters)
    },

    // END API v2

    getUser (userId) {
        return Vue.axios.get(API_V1_URL + '/profile/users/' + userId, OPTIONS)
    },

    createUser (data) {
        return Vue.axios.post(API_V1_URL + '/profile/users/', data, OPTIONS)
    },

    updateUser (userId, data) {
        return Vue.axios.put(API_V1_URL + '/profile/users/' + userId, data, OPTIONS)
    },

    getUsers () {
        return Vue.axios.get(API_V1_URL + '/profile/users/', OPTIONS)
    },

    getUserPicture (userId) {
        return Vue.axios.get(API_V1_URL + '/profile/users/' + userId + '/picture', OPTIONS)
    },

    getUsersByIds (ids) {
        return Vue.axios.post(API_V1_URL + '/profile/users/get-by-ids', ids, OPTIONS)
    },

    getTenantUsers (data) {
        let route = API_V1_URL + '/context/clients/' + CLIENT_ID +
            '/tenants/' + data.tenant.id +
            '/users/?fields=User:id,name,externalId'

        return Vue.axios.get(route, OPTIONS)
    },

    addUserToTenant (userId, tenantId, metadata = null) {
        let route = API_V1_URL + '/context/clients/' + CLIENT_ID + '/add-user'

        let data = {
            UserId: userId,
            TenantId: tenantId,
            Metadata: metadata
        }

        return Vue.axios.post(route, data, OPTIONS)
    },

    removeUserFromTenant (userId, tenantId) {
        let route = API_V1_URL + '/context/clients/' + CLIENT_ID + '/remove-user'

        let data = {
            UserId: userId,
            TenantId: tenantId
        }

        return Vue.axios.post(route, data, OPTIONS)
    },

    getTenantMetadata (userId, tenantId) {
        let route = API_V1_URL + '/profile/users/' + userId +
            '/clients/' + CLIENT_ID +
            '/tenants/' + tenantId +
            '/metadata'

        return Vue.axios.get(route, OPTIONS)
    },

    authorization: {
        getRoles (userId, tenantId) {
            let route = API_V1_URL +
                '/profile/users/' + userId +
                '/clients/' + CLIENT_ID +
                '/tenants/' + tenantId +
                '/roles'

            return Vue.axios.get(route, OPTIONS)
        },

        getClaims (userId, tenantId) {
            let route = API_V1_URL +
                '/profile/users/' + userId +
                '/clients/' + CLIENT_ID +
                '/tenants/' + tenantId +
                '/claims'

            return Vue.axios.get(route, OPTIONS)
        },

        saveRoles (userId, tenantId, roles) {
            let route = API_V1_URL +
                '/profile/users/' + userId +
                '/clients/' + CLIENT_ID +
                '/tenants/' + tenantId +
                '/roles'

            return Vue.axios.post(route, {roles}, OPTIONS)
        },

        saveClaims (userId, tenantId, claims) {
            let route = API_V1_URL +
                '/profile/users/' + userId +
                '/clients/' + CLIENT_ID +
                '/tenants/' + tenantId +
                '/claims'

            return Vue.axios.post(route, {claims}, OPTIONS)
        }
    },

    backend: {
        retrieve (parameters) {
            return requestService.retrieve(BACKEND_API_V1_URL + '/users/', parameters)
        },
    }
}

export default usersService
