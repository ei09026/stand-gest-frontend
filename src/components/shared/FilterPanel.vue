<template>
    <div class="ibox m-b-none filter-panel">
        <div class="ibox-title flex flex-align-center"
            @click="isOpen = !isOpen">

            <h5 class="no-margins no-wrap">
                {{ $i18n.tc('ui-elements.filter-panel.filter', 2) }}

                <i class="fa fa-filter text-warning m-l-xs"
                    v-show="filteredResults"></i>
            </h5>

            <input class="form-control m-l-md m-r-md"
                v-if="hasSearch"
                v-model="search"
                :placeholder="searchPlaceholder || $i18n.t('general.search')"
                @input="$emit('input', $event.target.value)"
                @click.stop>

            <div class="ibox-tools">
                <a class="collapse-link">
                    <i class="fa"
                        :class="{
                            'fa-chevron-up': isOpen,
                            'fa-chevron-down': !isOpen
                        }"></i>
                </a>
            </div>
        </div>

        <div class="ibox-content"
            v-show="isOpen">
            <slot></slot>
        </div>

        <div class="ibox-footer text-right" v-show="isOpen">
            <button class="btn btn-circle btn-danger"
                v-tooltip="{title: $i18n.tc('ui-elements.filter-panel.clear-tooltip', 2), placement: 'bottom'}"
                v-show="filteredResults" :class="{
                    'btn-outline': clearButtonEnabled,
                    'disabled': !clearButtonEnabled
                }"
                @click="$emit('clear')">

                <i class="fa fa-eraser"></i>
            </button>

            <button class="btn btn-circle btn-primary m-l-sm"
                v-tooltip="{title: $i18n.tc('ui-elements.filter-panel.apply-tooltip', 2), placement: 'bottom'}"
                :class="{
                    'btn-outline': filterButtonEnabled,
                    'disabled': !filterButtonEnabled
                }"
                @click="$emit('filter')">

                <i class="fa fa-filter"></i>
            </button>
        </div>
    </div>
</template>

<script>
    import tooltip from '@/directives/tooltip'

    export default {
        directives: {
            tooltip
        },

        props: {
            show: {
                type: Boolean,
                default: false
            },

            filteredResults: {
                type: Boolean,
                default: false
            },

            value: {
                type: String,
                default: ''
            },

            searchPlaceholder: {
                type: String,
                default: ''
            },

            hasSearch: {
                type: Boolean,
                default: false
            },

            filterButtonEnabled: {
                type: Boolean,
                default: true
            },

            clearButtonEnabled: {
                type: Boolean,
                default: true
            }
        },

        data () {
            return {
                isShowing: this.show,

                search: this.value
            }
        },

        computed: {
            isOpen: {
                get () {
                    return this.isShowing
                },

                set (value) {
                    this.isShowing = value

                    this.$emit('toggled', value)
                }
            }
        },

        watch: {
            value (value) {
                this.search = value
            }
        }
    }
</script>

<style>
    .filter-panel .ibox-title {
        cursor: pointer;
    }

    .no-wrap {
        white-space: nowrap
    }
</style>
