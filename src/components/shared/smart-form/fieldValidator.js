import _ from 'lodash'
import moment from 'moment'

let validators = {
    email (value) {
        if (value && !/\S+@\S+\.\S+/.test(value)) {
            return buildError('email')
        }

        return null
    },

    phone (value) {
        if (value && !/^(?:(?:\+|00)[1-9]{1}[0-9]{1,2}[- ]?)?[0-9]{6,11}$/.test(value)) {
            return buildError('phone')
        }

        return null
    },

    min (value, params) {
        if (value.length < parseInt(params)) {
            return buildError('min', { length: params })
        }

        return null
    },

    max (value, params) {
        if (value.length > parseInt(params)) {
            return buildError('max', {length: params})
        }

        return null
    },

    // less or equal
    ofAge (value) {
        var todayDate = moment(new Date())
        var birthDate = moment(value)

        var age = todayDate.diff(birthDate, 'years', true)

        if (age < 18) {
            return buildError('ofAge')
        }
    },

    // Operations

    // greater or equal
    gETDate (value, params, model) {
        var fromDate = null
        var toDate = null

        if (params.indexOf('#') > -1) {
            toDate = moment(value)
            fromDate = moment(model[params.substring(1, params.length)])
        } else {
            toDate = moment(value)
            fromDate = moment(model[params])
        }

        if (toDate < fromDate) {
            return buildError('expirationDate')
        }
    },

    // less or equal
    lETDate (value, params, model) {
        var fromDate = null
        var toDate = null

        if (params.indexOf('#') > -1) {
            fromDate = moment(value)
            toDate = moment(model[params.substring(1, params.length)])
        } else {
            fromDate = moment(value)
            toDate = moment(model[params])
        }

        if (toDate < fromDate) {
            return buildError('expirationDate')
        }
    },

    lEToday (value) {
        var todayDate = moment(new Date())
        var date = moment(value)

        if (date > todayDate) {
            return buildError('dateLessEqualsToday')
        }
    }
}

let buildError = (key, params) => {
    return {
        key: errors[key],
        params: params || null
    }
}

let errors = {
    email: 'ui-elements.smart-form.invalid-email-format',
    phone: 'ui-elements.smart-form.invalid-phone-format',
    min: 'ui-elements.smart-form.min-length',
    max: 'ui-elements.smart-form.max-length',
    gtDate: 'ui-elements.smart-form.max-length',
    expirationDate: 'ui-elements.smart-form.expiration-date',
    ofAge: 'ui-elements.smart-form.of-age',
    dateLessEqualsToday: 'ui-elements.smart-form.date-less-equals-today'
}

let getError = (expressions, field, model) => {
    let expressionArray = expressions.split('|')

    for (let i = 0; i < expressionArray.length; i++) {
        let expression = expressionArray[i]

        if (expression.indexOf(':') >= 0) {
            let expressionNameAndParams = expression.split(':')

            let name = expressionNameAndParams[0]

            let params = expressionNameAndParams[1]

            let error = validators[name](model[field], params, model)

            if (error) {
                return error
            }
        } else {
            let error = validators[expression](model[field])

            if (error) {
                return error
            }
        }
    }

    return null
}

export default {
    // Returns null if no errors or an error otherwise
    getError (validations, field, model) {
        let validation = _.find(validations, validation => validation.field === field)

        if (validation) {
            let error = getError(validation.expression, field, model)

            if (error) {
                return error
            }
        }

        return null
    }
}
