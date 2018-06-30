<script>
    import {Bar} from 'vue-chartjs'
    import renderMixin from './renderMixin'

    export default {
        extends: Bar,
        mixins: [renderMixin],

        props: {
            stacked: Boolean
        },

        computed: {
            defaultOptions () {
                let options = {}

                if (this.stacked) {
                    options.scales = {
                        xAxes: [{stacked: true}],
                        yAxes: [{stacked: true}]
                    }
                }

                return options
            }
        }
    }
</script>
