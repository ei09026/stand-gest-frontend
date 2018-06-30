<template>
    <span class="switch-button" :class="switchButtonClass">
        <small></small>
    
        <span class="divider divider-1" v-tooltip="{title: dividerTooltip(1), position: tooltipPosition}" @click="clicked(1)">
            <i class="fa fa-circle"></i>
        </span>
    
        <span class="divider divider-2" v-tooltip="{title: dividerTooltip(2), position: tooltipPosition}" @click="clicked(2)">
            <i class="fa fa-circle"></i>
        </span>
    
        <span class="divider divider-3" v-if="type === 'red-off-green'" v-tooltip="{title: dividerTooltip(3), position: tooltipPosition}" @click="clicked(3)">
            <i class="fa fa-circle"></i>
        </span>
    </span>
</template>

<script>
    /*
        STATE:
        off: null
        red: false
        green: true
    */
    import tooltip from '@/directives/tooltip'

    export default {
        directives: {
            tooltip
        },

        props: {
            type: {
                type: String,
                default: 'off-green',
                validation (value) {
                    return value === 'off-green' ||
                        value === 'red-green' ||
                        value === 'red-off-green'
                }
            },

            value: {
                type: null,
                default: null
            },

            tooltipRed: String,
            tooltipOff: String,
            tooltipGreen: String,

            tooltipPosition: {
                type: String,
                default: 'top'
            },

            noTooltips: {
                type: Boolean,
                default: false
            },

            disabled: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                state: this.value
            }
        },

        computed: {
            tooltips () {
                return {
                    red: this.tooltipRed || this.$i18n.t('state.deny'),
                    off: this.tooltipOff || this.$i18n.t('state.off'),
                    green: this.tooltipGreen ||
                    (this.type === 'off-green' ? this.$i18n.t('state.on') : this.$i18n.t('state.allow'))
                }
            },

            switchButtonClass () {
                if (this.type === 'red-green') {
                    return {
                        'red-green': true,
                        'red': !this.state,
                        'green': !!this.state,
                        'disabled': this.disabled
                    }
                }

                if (this.type === 'red-off-green') {
                    return {
                        'red-off-green': true,
                        'red': this.state === false,
                        'off': this.state === null,
                        'green': this.state === true,
                        'disabled': this.disabled
                    }
                }

                // default: off-green
                return {
                    'off-green': true,
                    'off': !this.state,
                    'green': !!this.state,
                    'disabled': this.disabled
                }
            }
        },

        methods: {
            dividerTooltip (divider) {
                if (this.noTooltips) {
                    return ''
                }

                let tooltips = {
                    red: this.tooltips.red,
                    off: this.tooltips.off,
                    green: this.tooltips.green
                }

                return tooltips[this.type.split('-')[divider - 1]]
            },

            clicked (divider) {
                if (this.disabled) {
                    return
                }

                if (this.type === 'red-green' || this.type === 'off-green') {
                    this.state = divider !== 1
                }

                if (this.type === 'red-off-green') {
                    /* eslint-disable */
                    switch (divider) {
                        case 1: {
                            this.state = false
                            break
                        }
                        case 3: {
                            this.state = true
                            break
                        }
                        default: {
                            this.state = null
                        }
                    }
                    /* eslint-enable */
                }

                this.$emit('input', this.state)
            }
        },

        watch: {
            value (value) {
                this.state = value
            }
        }
    }
</script>

<style>
.switch-button {
    background-color: #fff;
    border: 1px solid #dfdfdf;
    border-radius: 20px;
    cursor: pointer;
    display: inline-block;
    height: 30px;
    position: relative;
    vertical-align: middle;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
}

.switch-button.red-green,
.switch-button.off-green {
    width: 60px;
}

.switch-button.red-off-green {
    width: 90px;
}

.switch-button>.divider {
    width: 30px;
    height: 30px;
    position: absolute;
}

.switch-button>.divider-1 {
    left: 0px;
}

.switch-button>.divider-2 {
    left: 30px;
}

.switch-button>.divider-3 {
    left: 60px;
}

.switch-button>.divider>.fa {
    display: none;
    padding: 9px;
    opacity: 0.25;
}

.switch-button:not(.off)>.divider>.fa {
    color: #fff;
}

.switch-button.red-green.red>.divider-1>.fa,
.switch-button.red-green.green>.divider-2>.fa,
.switch-button.off-green.off>.divider-1>.fa,
.switch-button.off-green.green>.divider-2>.fa,
.switch-button.red-off-green.red>.divider-1>.fa,
.switch-button.red-off-green.off>.divider-2>.fa,
.switch-button.red-off-green.green>.divider-3>.fa {
    color: #676a6c;
}

.switch-button>.divider:hover>.fa {
    display: inline-block;
}

.switch-button.off {
    border-color: rgb(223, 223, 223);
    box-shadow: rgb(223, 223, 223) 0px 0px 0px 0px inset;
    transition: border 0.4s, box-shadow 0.4s;
}

.switch-button.red {
    border-color: rgb(237, 85, 101);
    box-shadow: rgb(237, 85, 101) 0px 0px 0px 16px inset;
    transition: border 0.4s, box-shadow 0.4s, background-color 1.2s;
    background-color: rgb(237, 85, 101);
}

.switch-button.green {
    border-color: rgb(26, 179, 148);
    box-shadow: rgb(26, 179, 148) 0px 0px 0px 16px inset;
    transition: border 0.4s, box-shadow 0.4s, background-color 1.2s;
    background-color: rgb(26, 179, 148);
}

.switch-button>small {
    background: #fff;
    border-radius: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    height: 30px;
    position: absolute;
    top: 0;
    width: 30px;
    left: 0px;
    transition: left 0.2s;
}

.switch-button.red-off-green.red>small,
.switch-button.red-green.red>small,
.switch-button.off-green.off>small {
    left: 0px;
}

.switch-button.red-off-green.off>small,
.switch-button.red-green.green>small,
.switch-button.off-green.green>small {
    left: 30px;
}

.switch-button.red-off-green.green>small {
    left: 60px;
}

.switch-button.disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.switch-button.disabled>small {
    background-color: #f0f0f0;
}

.switch-button.disabled.red-green.red>.divider:not(.divider-1),
.switch-button.disabled.red-green.green>.divider:not(.divider-2),
.switch-button.disabled.off-green.off>.divider:not(.divider-1),
.switch-button.disabled.off-green.green>.divider:not(.divider-2),
.switch-button.disabled.red-off-green.red>.divider:not(.divider-1),
.switch-button.disabled.red-off-green.off>.divider:not(.divider-2),
.switch-button.disabled.red-off-green.green>.divider:not(.divider-3) {
    display: none;
}
</style>
