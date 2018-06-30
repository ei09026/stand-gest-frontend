<template>
    <div class="smart-form-field form-group"
        :class="{'has-error': error}"
        v-show="properties.visible">

        <label class="control-label" v-text="label"></label>

        <!--TODO: create components for all possible types -->

        <input
            class="form-control field-input"
            v-if="type === 'text'"
            :value="workingValue"
            @input="saveValue($event)"
            :disabled="properties.readOnly">

        <multiselect
            v-if="type === 'select'"
            :value="workingValue"
            @input="saveValue($event)"
            :options="options"
            :searchable="true"
            :show-labels="false"
            :close-on-select="true"
            label="label" track-by="value"
            :loading="properties.info.loading"
            :disabled="properties.readOnly">
        </multiselect>

        <date-time-picker
            class="m-b-none"
            v-if="type === 'datetime' || type === 'date'"
            :value="workingValue"
            @input="saveValue($event)"
            :disabled="properties.readOnly">
        </date-time-picker>

        <switch-button
            v-if="type === 'switch'"
            :value="workingValue"
            @input="saveValue($event)"
            class="pull-right"
            type="off-green"
            :tooltip-off="properties.info.tooltipOff"
            :tooltip-green="properties.info.tooltipOn">
        </switch-button>

        <span class="help-block" v-show="error" v-text="error"></span>
    </div>
</template>

<script>
    import _ from 'lodash'
    import moment from 'moment'
    import utilities from '@/components/shared/smart-form/utilities'
    import Multiselect from '@/components/shared/multi-select'
    import DateTimePicker from '@/components/shared/input/DateTimePicker'
    import SwitchButton from '@/components/shared/input/SwitchButton'

    export default {
        components: {
            Multiselect,
            DateTimePicker,
            SwitchButton
        },

        props: {
            properties: {
                type: Object,
                required: true
            },

            value: null,

            error: String
        },

        computed: {
            type () {
                return utilities.getFieldType(this.properties.info)
            },

            label () {
                return utilities.getFieldLabel(this.properties.field, this.properties.info)
            },

            options () {
                if (this.type !== 'select') {
                    return []
                }

                return utilities.getFieldOptions(this.properties.info.options)
            },

            workingValue () {
                if (!this.value) {
                    return null
                }

                if (this.type === 'select') {
                    return _.find(this.options, { value: this.value })
                }

                if (this.type === 'datetime') {
                    // DateTimePicker needs a Date object
                    return moment(this.value).toDate()
                }

                if (this.type === 'date') {
                    return moment(this.value, 'YYYY-MM-DD').toDate()
                }

                return this.value
            }
        },

        methods: {
            valueFirewall (value) {
                if (this.type === 'date') {
                    let date = moment(value, 'YYYY-MM-DD')

                    if (!date.isValid()) {
                        this.$emit('input', null)
                    }
                }
            },

            saveValue (value) {
                if (this.type === 'switch') {
                    this.$emit('input', !!value)
                    return
                }

                if (!value) {
                    this.$emit('input', null)
                    return
                }

                if (this.type === 'select') {
                    this.$emit('input', value.value)
                    return
                }

                if (this.type === 'datetime') {
                    // Value should be a Date object
                    this.$emit('input', moment(value).toJSON())
                    return
                }

                if (this.type === 'date') {
                    this.$emit('input', moment(value).format('YYYY-MM-DD'))
                    return
                }

                if (this.type === 'text') {
                    this.$emit('input', value.target.value)
                    return
                }

                this.$emit('input', value)
            }
        },

        watch: {
            value (value) {
                this.valueFirewall(value)
            }
        },

        created () {
            this.valueFirewall(this.value)
        }
    }
</script>

<style>
    .smart-form-field {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 300px;
        max-width: 380px;
        margin: 10px;
    }


    i.far.check-icon.fa-square {
        margin-right: 6.86px;
    }

    i.far.check-icon.fa-check-square {
        margin-right: 5px;
    }

    i.far.check-icon-lg {
        font-size: 18px;
        margin-top: 1px;
    }

    i.far.check-icon-lg.fa-square {
        margin-right: 10.76px;
    }

    i.far.check-icon-lg.fa-check-square {
        margin-right: 8px;
    }
</style>
