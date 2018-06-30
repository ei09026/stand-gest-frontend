<template>
    <div class="checkable-all" :class="itemClass" @click="toggleAllChecked">
        <i class="far fa-fw m-r-xs"
            :class="{
                'fa-square': !isAllChecked,
                'fa-check-square': isAllChecked
            }"></i>
        <slot></slot>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        props: {
            value: {
                type: Array,
                required: true
            },

            originalSet: {
                type: Array,
                required: true
            },

            itemClass: {
                type: [Object, Array],
                default () {
                    return {}
                }
            }
        },

        data () {
            return {
                checkedSet: this.value
            }
        },

        computed: {
            isAllChecked () {
                if (!this.checkedSet.length) {
                    return false
                }

                return _.isEmpty(_.xor(this.checkedSet, this.originalSet))
            }
        },

        methods: {
            toggleAllChecked () {
                if (this.isAllChecked) {
                    this.checkedSet = []
                } else {
                    this.checkedSet = this.originalSet
                }

                this.$emit('input', this.checkedSet)
            }
        },

        watch: {
            value (newValue) {
                this.checkedSet = newValue
            }
        }
    }
</script>
