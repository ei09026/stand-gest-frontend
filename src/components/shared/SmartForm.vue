<template>
    <div class="smart-form">
        <div class="alert alert-danger" v-if="isFormEmpty" v-text="$i18n.t('configurations.forms.this-form-is-not-configured')"></div>
    
        <template v-if="!isFormEmpty">
    
            <loading v-show="isLoading"></loading>
    
            <wizard v-if="!isLoading" v-model="currentStep" :steps="wizard.steps" :finishable-from="wizard.finishableFrom" :finishable="isValid" :loading="loading" @finished="save">
    
                <loading v-show="loading"></loading>
    
                <div class="flex flex-column" v-show="!loading">
    
                    <div class="flex flex-wrap flex-justify-start">
                        <field v-for="field in wizard.steps[currentStep].fields" :key="field" :properties="form[field]" :error="fieldErrors[field]" :value="decidedValue(field)" @input="fieldInput(field, $event)"></field>
                    </div>
                </div>
            </wizard>
        </template>
    </div>
</template>

<script>
    import _ from 'lodash'
    import formService from '@/services/shared/smart-forms/dummy-config.service'
    import conditionResolver from '@/components/shared/smart-form/conditionResolver'
    import fieldValidator from '@/components/shared/smart-form/fieldValidator'
    import utilities from '@/components/shared/smart-form/utilities'
    import { mapGetters, mapActions } from 'vuex'
    import Loading from '@/components/shared/Loading'
    import Wizard from '@/components/shared/Wizard'
    import Field from '@/components/shared/smart-form/Field'

    export default {
        components: {
            Loading,
            Wizard,
            Field
        },

        props: {
            slug: {
                type: String,
                required: true
            },

            // Represents the Model and is always required, even if all fields are empty
            value: {
                type: Object,
                required: true
            },

            modelInfo: {
                type: Object,
                required: true
            },

            loading: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                configuration: {},

                modelProxy: null,

                currentStep: 0
            }
        },

        computed: {
            ...mapGetters([
                'loadings'
            ]),

            isLoading () {
                return this.loadings.indexOf('smart-form-retrieving-configuration-' + this._uid) >= 0
            },

            form () {
                if (!this.modelProxy || _.isEmpty(this.modelInfo)) {
                    return {}
                }

                // This will contain the final form structure
                let form = {}

                let self = this

                // Build the fields' properties from the configurations
                _.forEach(self.configuration.fieldConfigurations, configuration => {
                    let properties = {
                        field: null,
                        info: null,
                        visible: null,
                        mandatory: null,
                        readOnly: null,
                        value: null
                    }

                    // Resolve the properties' values from the configuration
                    _.forEach(['visible', 'mandatory', 'readOnly', 'value'], key => {
                        properties[key] = self.resolvePropertyValue(configuration[key])
                    })

                    // Add the field configuration to the final form
                    _.forEach(configuration.fields, field => {
                        // Ignore the fields without information
                        if (!self.modelInfo[field]) {
                            console.warn('No model information available for field \'' + field + '\'')
                            return // continue
                        }

                        // If a configuration is already set for the field, don't override.
                        // (If several configurations exist for the same field, the first one is used)
                        if (form[field] === undefined) {
                            let fieldProperties = Object.assign({}, _.cloneDeep(properties), {
                                field,
                                info: self.modelInfo[field]
                            })

                            Object.assign(form, { [field]: fieldProperties })
                        }
                    })
                })

                return form
            },

            isFormEmpty () {
                return _.isEmpty(this.form)
            },

            wizard () {
                if (!this.configuration) {
                    return null
                }

                let steps

                if (this.configuration.wizard && this.configuration.wizard.steps && this.configuration.wizard.steps.length) {
                    steps = this.configuration.wizard.steps
                } else {
                    steps = [
                        {
                            fields: Object.keys(this.form)
                        }
                    ]
                }

                let finishableFrom

                let lastStep = steps.length - 1

                if (this.configuration.wizard &&
                    this.configuration.wizard.finishableFrom !== undefined &&
                    this.configuration.wizard.finishableFrom !== null) {
                    finishableFrom = this.configuration.wizard.finishableFrom

                    if (finishableFrom > lastStep) {
                        finishableFrom = lastStep
                    }
                } else {
                    finishableFrom = lastStep
                }

                return { finishableFrom, steps }
            },

            fieldErrors () {
                let self = this

                return _.mapValues(self.form, (properties, field) => {
                    // Validate mandatory
                    let isEmptyValue

                    if (_.isNil(self.modelProxy[field])) {
                        isEmptyValue = true
                    } else {
                        if (properties.info.type === 'text') {
                            isEmptyValue = _.isEmpty(self.modelProxy[field].trim())
                        } else {
                            isEmptyValue = !self.modelProxy[field]
                        }
                    }

                    if (properties.mandatory && isEmptyValue) {
                        return self.$i18n.t('ui-elements.smart-form.this-field-is-mandatory')
                    }

                    if (!properties.visible || isEmptyValue) {
                        return null
                    }

                    // Field validations
                    let error = fieldValidator.getError(self.configuration.fieldValidations, field, self.modelProxy)

                    return error ? self.$i18n.t(error.key, error.params) : null
                })
            },

            isValid () {
                return !_.filter(this.fieldErrors, value => !!value).length
            }
        },

        methods: {
            ...mapActions([
                'loadingAdd',
                'loadingRemove'
            ]),

            resolvePropertyValue (configuration) {
                let value

                if (configuration.default !== undefined) {
                    value = configuration.default
                } else if (configuration.fieldDefault !== undefined) {
                    value = this.modelProxy[configuration.fieldDefault]
                }

                // If no rules, use the default value
                if (_.isEmpty(configuration.rules)) {
                    return value
                }

                let self = this

                // Use the value of the first rule that matches
                _.forEach(configuration.rules, rule => {
                    if (self.matchRule(rule)) {
                        if (rule.value !== undefined) {
                            value = rule.value
                        } else if (rule.fieldValue !== undefined) {
                            value = self.modelProxy[rule.fieldValue]
                        }

                        return false // break
                    }
                })

                return value
            },

            matchRule (rule) {
                if (!rule || _.isEmpty(rule.conditionSet)) {
                    return false
                }

                return this.matchConditionSet(rule.conditionSet)
            },

            // conditionSet is always an array (that's why it is called a 'set')
            matchConditionSet (conditionSet) {
                let expression = ''

                let self = this

                // Build expression
                _.forEach(conditionSet, (conditionModel, index) => {
                    let conditionMatches = false

                    if (conditionModel.condition !== undefined) {
                        conditionMatches = self.matchCondition(conditionModel.condition)
                    } else if (conditionModel.conditionSet !== undefined) {
                        conditionMatches = self.matchConditionSet(conditionModel.conditionSet)
                    }

                    if (index > 0) {
                        expression += (conditionModel.aggregator === 'or' ? ' || ' : ' && ')
                    }

                    expression += conditionMatches ? ' true ' : ' false '
                })

                /* eslint-disable */
                return !!eval(expression)
                /* eslint-enable */
            },

            matchCondition (condition) {
                let type = this.getFieldType(condition.field)

                let valueA = this.modelProxy[condition.field] || null

                let self = this

                // Resolve the target values of the condition
                let valueB = condition.target.map(target => {
                    if (target.type === 'value') {
                        return target.value
                    } else if (target.type === 'field') {
                        return self.modelProxy[target.value]
                    }
                })

                // For a simple operator, get just the single value
                if (['>', '>=', '<', '<=', '==', '!='].indexOf(condition.operator) >= 0) {
                    valueB = valueB[0]
                }

                if (!valueA || !valueA.trim()) {
                    valueA = null
                }

                if (!valueB || !valueB.trim()) {
                    valueB = null
                }

                return conditionResolver.resolve(valueA, condition.operator, valueB, type)
            },

            decidedValue (field) {
                if (this.form[field].visible) {
                    return this.modelProxy[field]
                }

                this.modelProxy[field] = this.form[field].value

                return this.form[field].value
            },

            getFieldType (field) {
                return utilities.getFieldType(this.modelInfo[field])
            },

            getFieldLabel (field) {
                return utilities.getFieldLabel(field, this.modelInfo[field])
            },

            fieldInput (field, value) {
                this.modelProxy[field] = value
            },

            save () {
                if (!this.isValid) {
                    return
                }

                this.$emit('save', this.modelProxy)
            }
        },

        watch: {
            value (model) {
                if (!_.isEqual(model, this.modelProxy)) {
                    this.modelProxy = _.cloneDeep(model)
                }
            },

            modelProxy: {
                deep: true,
                handler (modelProxy) {
                    if (!_.isEqual(modelProxy, this.value)) {
                        this.$emit('input', modelProxy)
                    }
                }
            }
        },

        created () {
            this.modelProxy = _.cloneDeep(this.value)

            this.loadingAdd('smart-form-retrieving-configuration-' + this._uid)

            // Load configurations for slug 'this.slug', then:
            this.configuration = formService.configurations.retrieve(this.slug)
            this.loadingRemove('smart-form-retrieving-configuration-' + this._uid)
        }
    }
</script>

<style>
.smart-form .save-button {
    align-self: flex-end;
    margin-top: 10px;
    margin-right: 10px;
}
</style>
