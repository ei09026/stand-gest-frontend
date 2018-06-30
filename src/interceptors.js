import Vue from 'vue'

import { bearerInterceptor } from '@/interceptors/bearer.interceptor.js'
import {jwtAuthInterceptor} from '@/interceptors/jwtAuth.interceptor.js'
import {errorInterceptor} from '@/interceptors/error.interceptor.js'

function bootInterceptors () {
    var interceptors = []

    interceptors.push(
        bearerInterceptor,
        jwtAuthInterceptor,
        errorInterceptor
    )

    for (let i = 0; i < interceptors.length; i++) {
        if (interceptors[i].type === 'request') {
            Vue.axios.interceptors.request.use(interceptors[i].process, interceptors[i].exception)
        } else if (interceptors[i].type === 'response') {
            Vue.axios.interceptors.response.use(interceptors[i].process, interceptors[i].exception)
        }
    }
}

export {bootInterceptors}
