import env from '@/core/env'

export default {
    app_env: env.get('app_env', 'production'),
    app_name: 'Auto Gest',
    app_module: 'WebFrontend',
    app_name_short: 'IDT',
    locale: 'pt_PT',

    router: {
        // Remove leading and trailling slashes, if present
        prefix: env.get('router_prefix', '').replace(/^\/|\/$/g, '') || ''
    },

    signalr: {
        endpoint: env.get('signalr_endpoint_auth')
    },

    api: {
        endpoints: {
            auth: env.get('endpoint_auth'),
            backend: env.get('endpoint_backend', 'http://localhost')
        },

        default_request: {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        },

        idt2auth_domain_id: env.get('idt2auth_domain_id'),
        idt2auth_client_id: env.get('idt2auth_client_id')
    },

    url: {
        unauthorized: '/401',
        not_found: '/404',
        internal_server_error: '/500'
    },

    claim_dependencies: {
        BO_USERS: ['BACKOFFICE'],
        BO_USERS_OVERVIEW: ['BO_USERS'],
        BO_USERS_EDIT_PERSONAL_DATA: ['BO_USERS_OVERVIEW'],
        BO_USERS_EDIT_PASSWORD: ['BO_USERS_OVERVIEW'],
        BO_USERS_AGENCIES: ['BO_USERS_OVERVIEW'],
        BO_USERS_AUTHORIZATION: ['BO_USERS_OVERVIEW'],
        BO_USERS_CREATE: ['BO_USERS_OVERVIEW'],
        BO_USERS_BLOCK: ['BO_USERS_OVERVIEW'],
        BO_CONFIGURATIONS_AUTHORIZATION: ['BACKOFFICE'],
        BO_CONFIGURATIONS_FORMS: ['BACKOFFICE'],
        BO_CONFIGURATIONS_TABLES: ['BACKOFFICE']
    },

    build_number: env.get('build_number')
}
