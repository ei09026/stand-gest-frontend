<template>
    <div class="date-time-picker form-group has-feedback has-clear">
        <div :class="{'has-error': hasError}">
            <input type="text" class="form-control"
                :placeholder="'DD-MM-YYYY' + (finalOptions.timepicker ? ' HH:MM' : '')"
                v-picker="{date: selectedDate, options: finalOptions}"
                @input="manualInput($event.target.value)">
        </div>

        <a href="#" class="form-control-feedback form-control-clear"
            @click.prevent="manualInput(null)">
            <i class="fa fa-times"></i>
        </a>
    </div>
</template>

<script>
    // For the complete options documentation, please refer to:
    // http://t1m0n.name/air-datepicker/docs/

    import dateTimeService from '@/services/shared/dateTime.service'
    import moment from 'moment'
    import toastrService from '@/services/shared/toastr.service'

    export default {
        directives: {
            picker: {
                inserted (el, binding) {
                    var date = binding.value.date
                    var options = binding.value.options

                    /* eslint-disable */
                    var datePicker = $(el).datepicker(options).data('datepicker')
                    /* eslint-enable */

                    if (date) {
                        datePicker.selectDate(date)
                        datePicker.date = date
                    }
                },

                update (el, binding) {
                    var newDate = binding.value.date
                    var oldDate = binding.oldValue.date

                    var newOptions = binding.value.options
                    var oldOptions = binding.oldValue.options

                    /* eslint-disable */
                    var datePicker = $(el).data('datepicker')
                    /* eslint-enable */

                    var dateChanged = !dateTimeService.areDatesEqual(newDate, oldDate)
                    var optionsChanged = (newOptions !== oldOptions)

                    if (!dateChanged && !optionsChanged) {
                        return
                    }

                    if (optionsChanged) {
                        datePicker.update(newOptions)
                    }

                    if (dateChanged) {
                        if (!newDate) {
                            datePicker.clear()
                            datePicker.date = new Date()
                            return
                        }

                        datePicker.selectDate(newDate)
                        datePicker.date = newDate
                    }
                },

                unbind (el, binding) {
                    /* eslint-disable */
                    $(el).data('datepicker').destroy()
                    /* eslint-enable */
                }
            }
        },

        props: {
            value: null,

            options: {
                type: Object,
                default () {
                    return {}
                }
            }
        },

        data () {
            return {
                selectedDate: this.value,
                hasError: false
            }
        },

        computed: {
            finalOptions () {
                var self = this

                let selectedDate = new Date(self.selectedDate)

                let defaultOptions = {
                    // TODO: translation / locale
                    language: {
                        days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
                        daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                        daysMin: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Sx', 'Sa'],
                        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                        monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                        today: 'Hoje',
                        clear: 'Limpar',
                        dateFormat: 'dd-mm-yyyy',
                        timeFormat: 'hh:ii',
                        firstDay: 1
                    },

                    autoClose: true,

                    minutesStep: 5,
                    position: 'top left',
                    onSelect (formattedDate, date) {
                        // TODO: make sure that working date object is always UTC
                        // and formattedDate string is always local

                        if (!dateTimeService.areDatesEqual(selectedDate, date)) {
                            self.selectedDate = date
                            self.$emit('input', date)
                        }
                    }
                }

                // Override / force some options
                let overridenOptions = {
                    multipleDates: false,
                    dateTimeSeparator: ' ',
                    language: defaultOptions.language
                }

                // If the caller hooks into the onSelect event, we wrap it
                // in another function so that we can still listen aswell
                if (self.options.onSelect) {
                    overridenOptions.onSelect = (formattedDate, date) => {
                        defaultOptions.onSelect(formattedDate, date)
                        self.options.onSelect(formattedDate, date)
                    }
                }

                return Object.assign({}, defaultOptions, self.options, overridenOptions)
            }
        },

        methods: {
            // TODO: bind input to this method when moment and datepicker's
            // locale format (loaded from their i18n plugins) are matching correctly
            manualInput (value) {
                if (!value) {
                    this.selectedDate = null
                    return
                }

                var format = 'DD-MM-YYYY'

                if (this.finalOptions.timepicker) {
                    format += ' HH:mm'
                }

                // Must be the exact format
                if (value.length !== format.length) {
                    return
                }

                var newDate = moment(value, format)

                if (!newDate.isValid()) {
                    return
                }

                if (this.finalOptions.minDate) {
                    if (newDate < this.finalOptions.minDate) {
                        this.hasError = true
                        // TODO: translation / locale
                        toastrService.error('', 'A data de não pode ser inferior a<br><b>' + moment(this.finalOptions.minDate).format(format) + '</b>')
                        return
                    }
                }

                if (this.finalOptions.maxDate) {
                    this.hasError = true
                    if (newDate > this.finalOptions.maxDate) {
                        // TODO: translation / locale
                        toastrService.error('', 'A data de não pode ser superior a<br><b>' + moment(this.finalOptions.maxDate).format(format) + '</b>')
                        return
                    }
                }

                this.hasError = false
                this.selectedDate = newDate.toDate()
                this.$emit('input', this.selectedDate)
            }
        },

        watch: {
            value (newDate) {
                if (!dateTimeService.areDatesEqual(this.selectedDate, newDate)) {
                    this.selectedDate = newDate
                }
            }
        }
    }
</script>

<style>
    .datepicker {
        z-index: 2500;
    }

    .has-clear .form-control-clear {
        pointer-events: auto;
        text-decoration: none;
        cursor: pointer;
    }
</style>
