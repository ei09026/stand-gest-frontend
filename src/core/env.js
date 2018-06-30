import env from '@/.env'

let get = (key, value) => {
    return env.hasOwnProperty(key) ? env[key] : value
}

let environment = (env) => {
    if (!env || typeof env === 'undefined') {
        return get('app_env', 'production')
    } else {
        return get('app_env') === env
    }
}

export default {
    get, environment
}
