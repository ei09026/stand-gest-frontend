let bearerInterceptor = {
    type: 'request',

    process (request) {
        let token = 'Bearer ' + localStorage.getItem('token')

        // request interceptor
        request.headers.common['Authorization'] = token

        return request
    },

    exception (error) {
        return Promise.reject(error)
    }
}

export {bearerInterceptor}
