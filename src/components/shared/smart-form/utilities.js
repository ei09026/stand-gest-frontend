import _ from 'lodash'

export default {
    conditionOperators: ['>', '>=', '<', '<=', '==', '!=', 'between', 'notBetween', 'in', 'notIn'],

    getFieldType (fieldInfo) {
        if (!fieldInfo) {
            return null
        }

        return _.isString(fieldInfo)
            ? fieldInfo
            : fieldInfo.type
    },

    getFieldLabel (field, fieldInfo) {
        if (fieldInfo && fieldInfo.label) {
            return fieldInfo.label
        }

        return _.startCase(field)
    },

    getFieldOptions (options) {
        return options.map(option => {
            if (_.isString(option)) {
                return {
                    label: option,
                    value: option
                }
            }

            return {
                label: option.label || option.value,
                value: option.value
            }
        })
    },

    // Forms - configuration only utilities

    getValueInputType (fieldInfo) {
        // For 'datetime', it should display a picker
        // For other types, it should simply display a text picker

        let type = this.getFieldType(fieldInfo)

        if (['date', 'datetime'].indexOf(type) >= 0) {
            return type
        }

        return 'text'
    },

    targetsMode (operator) {
        if (['in', 'notIn'].indexOf(operator) >= 0) {
            return 'multiple'
        }

        if (['between', 'notBetween'].indexOf(operator) >= 0) {
            return 'range'
        }

        return 'single'
    }
}
