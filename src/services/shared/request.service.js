import Vue from 'vue'

let requestService = {
    cancelToken: {
        create () {
            return Vue.axios.CancelToken.source()
        },

        cancelAndCreate (cancelToken) {
            cancelToken.cancel()

            return this.create()
        },

        isCancel (exception) {
            return Vue.axios.isCancel(exception)
        }
    },

    get (endpoint, parameters) {
        return Vue.axios.get(endpoint,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                params: parameters,
                cancelToken: parameters.cancelToken ? parameters.cancelToken.token : null
            }
        )
    },

    post (endpoint, parameters) {
        return Vue.axios.post(endpoint, parameters,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                cancelToken: parameters.cancelToken ? parameters.cancelToken.token : null
            }
        )
    }
}

export default requestService
