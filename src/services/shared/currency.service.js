// import Vue from 'vue'
// import config from '@/core/config'

let currencyService = {
    currencyDefaults: {
        currency: {
            symbol: '€' // TODO: Load from configuration
        },
        decimalSeparator: ',',
        thousandsSeparator: '.',
        precision: 2,
        symbolLeft: false
    },
    formatMoney (options) {
        var params = {
            symbol: options.symbol || this.currencyDefaults.currency.symbol,
            decimal: this.currencyDefaults.decimalSeparator,
            thousand: this.currencyDefaults.thousandsSeparator,
            precision: this.currencyDefaults.precision,
            format: {
                pos: this.currencyDefaults.symbolLeft ? '%s %v' : '%v %s',
                neg: this.currencyDefaults.symbolLeft ? '%s -%v' : '-%v %s',
                zero: '--'
            }
        }

        if (options.signal === -1) {
            options.value *= -1
        }

        /*eslint-disable */
        return accounting.formatMoney(options.value, params)
        /*eslint-enable */
    }
}

export default currencyService
