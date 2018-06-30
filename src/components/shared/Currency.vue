<template>
    <span class="text-nowrap" v-text="formattedValue">
    </span>
</template>

<script>
    import currencyService from '@/services/shared/currency.service'

    export default {
        data () {
            return {
                currencyDefaults: {
                    currency: {
                        symbol: 'AOA' // TODO: Load from configuration
                    },
                    decimalSeparator: ',',
                    thousandsSeparator: '.',
                    precision: 2,
                    symbolLeft: false
                }
            }
        },

        props: {
            value: {
                type: Number,
                default: 0
            },
            symbol: {
                type: String
            },
            signal: {
                type: Number,
                default: 1
            }
        },

        computed: {
            formattedValue () {
                return this.formatMoney()
            }
        },

        methods: {
            formatMoney () {
                var options = {
                    symbol: this.symbol,
                    signal: this.signal,
                    value: this.value
                }
                return currencyService.formatMoney(options)

                /*
                var options = {
                    symbol: this.symbol || this.currencyDefaults.currency.symbol,
                    decimal: this.currencyDefaults.decimalSeparator,
                    thousand: this.currencyDefaults.thousandsSeparator,
                    precision: this.currencyDefaults.precision,
                    format: {
                        pos: this.currencyDefaults.symbolLeft ? '%s %v' : '%v %s',
                        neg: this.currencyDefaults.symbolLeft ? '%s -%v' : '-%v %s',
                        zero: '--'
                    }
                }
    
                var value = this.value
    
                if (this.signal === -1) {
                    value *= -1
                }
    
                return accounting.formatMoney(value, options)
                */
            }
        }
    }
</script>
