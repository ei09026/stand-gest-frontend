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

    retrieve (endpoint, parameters) {
        let body = Object.assign({
            token: localStorage.getItem('token'),
            method: 'retrieve'
        }, parameters)

        if (parameters && parameters.cancelToken) {
            return Vue.axios.post(endpoint, body, {cancelToken: parameters.cancelToken.token})
        } else {
            return Vue.axios.post(endpoint, body)
        }
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
    }
}

export default requestService
