import Vue from 'vue'

/*

Parameters example:

{
    filter: {
        ids: [10, 20, 30]
    },

    relations: ['details'],

    pagination: {
        itemsPerPage: 20,
        page: 1
    },

    orderBy: {
        column: 'name',
        direction: 'asc'
    },

    data: {
        name: 'John'
    },

    cancelToken: <token created with requestService.cancelToken.create()>
}

*/

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

    create (endpoint, parameters) {
        let body = Object.assign({
            token: localStorage.getItem('token'),
            method: 'create'
        }, parameters)

        return Vue.axios.post(endpoint, body)
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
    },

    update (endpoint, parameters) {
        let body = Object.assign({
            token: localStorage.getItem('token'),
            method: 'update'
        }, parameters)

        return Vue.axios.post(endpoint, body)
    },

    delete (endpoint, parameters) {
        let body = Object.assign({
            token: localStorage.getItem('token'),
            method: 'delete'
        }, parameters)

        return Vue.axios.post(endpoint, body)
    },


    get (endpoint, parameters) {
        let config = {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }

        let body = Object.assign(
            {
                token: localStorage.getItem('token'),
                method: 'retrieve'
            },
            parameters
        )

        if (parameters && parameters.cancelToken) {
            return Vue.axios.get(endpoint, parameters, Object.assign({cancelToken: parameters.cancelToken.token}, config))
        } else {
            return Vue.axios.get(endpoint, body, config)
        }
    }
}

export default requestService
