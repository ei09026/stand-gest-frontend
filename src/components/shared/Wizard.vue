<template>
    <div class="v-wizard" :class="{'single-step': singleStep}">
    
        <ol class="step-indicator" v-if="!singleStep">
            <li v-for="(step, index) in steps" :class="stepClass(index)" @click="goToStep(index)">
                <div class="step">
                    <i :class="[step.icon ? step.icon : 'fa fa-angle-right']"></i>
                </div>
                <div class="caption hidden-xs hidden-sm" v-text="step.title ? (index + 1) + '. ' + step.title : ''"></div>
            </li>
        </ol>
    
        <div class="content">
            <slot></slot>
        </div>
    
        <div class="navigation">
            <button class="btn btn-primary" v-if="!singleStep" :disabled="value === 0 || loading" @click="goToStep(value - 1)">
                <i class="fa fa-angle-left m-r-sm"></i>
                {{ $i18n.t('actions.previous') }}
            </button>
            <button class="btn btn-primary m-l-sm" v-if="!singleStep" :disabled="value === steps.length-1 || loading" @click="goToStep(value + 1)">
                {{ $i18n.t('actions.next') }}
                <i class="fa fa-angle-right m-l-sm"></i>
            </button>
            <button class="btn btn-success m-l-sm" v-if="finishableFrom !== null" :disabled="!canFinish || loading" @click="finished">
                {{ finishLabel }}
                <i class="fa fa-flag-checkered m-l-sm"></i>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            // Array of Step objects
            // Step: {title: string, icon: string, state: string [complete|error] (optional)}
            steps: {
                type: Array,
                required: true
            },

            value: {
                type: Number,
                required: true
            },

            // Marks that the form is finishable from step N
            // and shows the button from that step onwards
            // Null: never show the button
            // 0: always show the button
            finishableFrom: {
                type: Number,
                default: null
            },

            // Manually set to false to disable the finish button. Useful for validation.
            finishable: {
                type: Boolean,
                default: true
            },

            finishLabel: {
                type: String,
                default () {
                    return this.$i18n.t('actions.finish')
                }
            },

            finishIcon: {
                type: String,
                default: 'fa fa-flag-checkered'
            },

            loading: {
                type: Boolean,
                default: false
            }
        },

        computed: {
            singleStep () {
                return this.steps.length === 1
            },

            canFinish () {
                return this.finishable && this.value >= this.finishableFrom
            }
        },

        methods: {
            stepClass (index) {
                let active = this.value === index

                let stepState = this.steps[index].state || (index < this.value ? 'complete' : null)

                return {
                    'active': active,
                    'complete': !active && stepState === 'complete',
                    'error': !active && stepState === 'error'
                }
            },

            goToStep (index) {
                if (this.loading) {
                    return
                }

                this.$emit('input', index)
            },

            finished () {
                this.$emit('finished')
            }
        }
    }
</script>

<style>
.v-wizard {
    background: #eee;
    min-height: 120px;
    border-radius: 6px;
    padding: 20px;
}

.v-wizard .step-indicator {
    border-collapse: separate;
    display: table;
    position: relative;
    table-layout: fixed;
    text-align: center;
    vertical-align: middle;
    padding: 0px;
    margin: 0px;
}

.v-wizard .step-indicator li {
    display: table-cell;
    position: relative;
    float: none;
    padding: 0;
    width: 1%;
}

.v-wizard .step-indicator li:after {
    background-color: #ccc;
    content: "";
    display: block;
    height: 1px;
    position: absolute;
    width: 100%;
    top: 32px;
}

.v-wizard .step-indicator li:after {
    left: 50%;
}

.v-wizard .step-indicator li:last-child:after {
    display: none;
}

.v-wizard .step-indicator li.active .step {
    border-color: #1c84c6;
    color: #1c84c6;
}

.v-wizard .step-indicator li.active .caption {
    color: #1c84c6;
}

.v-wizard .step-indicator li.complete:after {
    background-color: #1ab394;
}

.v-wizard .step-indicator li.complete .step {
    border-color: #1ab394;
    color: #1ab394;
}

.v-wizard .step-indicator li.complete .caption {
    color: #1ab394;
}

.v-wizard .step-indicator li.error:after {
    background-color: #ed5565;
}

.v-wizard .step-indicator li.error .step {
    border-color: #ed5565;
    color: #ed5565;
}

.v-wizard .step-indicator li.error .caption {
    color: #ed5565;
}

.v-wizard .step-indicator .step {
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid #ccc;
    color: #ccc;
    font-size: 24px;
    height: 64px;
    line-height: 64px;
    margin: 0 auto;
    position: relative;
    width: 64px;
    z-index: 1;
}

.v-wizard .step-indicator .step:hover {
    cursor: pointer;
}

.v-wizard .step-indicator .caption {
    color: #ccc;
    padding: 11px 16px;
}

.v-wizard .content {
    padding: 20px 0px;
    border: 1px dashed #c6c6c6;
    border-left: none;
    border-right: none;
    margin: 20px 0px;
}

.v-wizard.single-step .content {
    border-top: none;
    margin-top: 0px;
    padding-top: 0px;
}

.v-wizard .navigation {
    text-align: center;
}
</style>
