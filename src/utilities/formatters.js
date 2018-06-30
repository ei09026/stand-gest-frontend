export default {
    formatMoney (value, precision = 2) {
        return currency(currency(value, {precision}), {
            formatWithSymbol: true,
            separator: '.',
            decimal: ',',
            precision
        }).format()
    },

    formatWeight (value, precision = 2) {
        return currency(currency(value, {precision}), {
            formatWithSymbol: false,
            separator: '.',
            decimal: ',',
            precision
        }).format()
    },

    formatPercentage (value, precision = 2) {
        return currency(currency(value, {precision}), {
            formatWithSymbol: false,
            separator: '.',
            decimal: ',',
            precision
        }).format() + '%'
    }
}