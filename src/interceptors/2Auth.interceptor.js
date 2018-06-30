import {router} from '@/routes'
import env from '@/core/env'

let idt2AuthInterceptor = (request, next) => {

    // request interceptor
    request.headers.set('X-2Auth-Domain-Id', env.get('idt2auth_domain_id'))
    request.headers.set('X-2Auth-Client-Id', env.get('idt2auth_client_id'))

    // response interceptor

    next()
}

export {idt2AuthInterceptor}
