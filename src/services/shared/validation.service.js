let validationService = {
    email (email) {
        // http://emailregex.com/
        /*eslint-disable */
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        /*eslint-enable */

        return regex.test(email)
    }
}

export default validationService
