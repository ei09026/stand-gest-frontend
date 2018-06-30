// Create chart components with this mixin.

// Uses Chart.js and vue-chartjs
// http://www.chartjs.org/
// http://vue-chartjs.org

// For more info on how to use the 'data' and 'options' objects,
// check the specific chart type documentation:
// http://www.chartjs.org/docs/latest/charts/

import _ from 'lodash'
import 'chartjs-plugin-datalabels'

export default {
    props: {
        data: {
            type: Object,
            required: true
        },

        options: Object
    },

    computed: {
        // Override this to define the chart's default options
        defaultOptions () {
            return null
        },

        finalOptions () {
            return _.merge(this.defaultOptions, this.options)
        }
    },

    methods: {
        updateChart (data, options) {
            data = data || this.data
            options = options || this.finalOptions

            this.renderChart(data, options)
        }
    },

    watch: {
        data: {
            deep: true,

            handler (data) {
                this.updateChart(data)
            }
        },

        finalOptions: {
            deep: true,

            handler (finalOptions) {
                this.updateChart(null, finalOptions)
            }
        }
    },

    mounted () {
        this.updateChart()
    }
}
