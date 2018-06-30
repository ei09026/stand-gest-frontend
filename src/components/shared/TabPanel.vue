<template>
    <div>
        <ul class="nav nav-tabs">
            <li
                :key="tab.id"
                v-for="tab in tabs"
                :class="{ active: tab == selectedTab }">

                <a href="#"
                    @click.prevent="selectTab(tab)">

                    <i
                        :class="tab.icon"></i>

                    {{ tab.name }}

                    <span class="label"
                        :class="(tab.labelClass || labelClass)"
                        v-if="useCounters && tab.count !== undefined">{{ tab.count }}</span>
                </a>
            </li>
        </ul>

        <div class="alert alert-info m-t text-center"
            v-if="displayNoResults && useCounters && selectedTab && selectedTab.count === 0">
            {{$i18n.t('general.no-results')}}
        </div>

        <slot
            v-if="!useCounters || (selectedTab && selectedTab.count) || !displayNoResults"></slot>
    </div>
</template>

<script>
    export default {
        props: {
            // Tab example: { name: 'tab1', icon: 'fa fa-book', count: 10, labelClass: 'label-danger' (optional) }
            tabs: {
                type: Array,
                required: true
            },

            useCounters: {
                type: Boolean,
                default: false
            },

            labelClass: {
                type: String,
                default: 'label-primary'
            },

            newSelectedTab: {
                type: Object,
                required: false
            },

            displayNoResults: {
                type: Boolean,
                default: true
            },

            preSelectFirst: {
                type: Boolean,
                default: true
            }
        },

        data () {
            return {
                selectedTab: this.newSelectedTab
            }
        },

        computed: {
            isUsingCounters () {
                return this.useCounters
            }
        },

        methods: {
            selectTab (tab) {
                this.selectedTab = tab
                this.$emit('selectTab', this.selectedTab)
            }
        },

        created () {
            if (this.preSelectFirst) {
                this.selectedTab = this.tabs.length ? this.tabs[0] : null
                this.$emit('selectTab', this.selectedTab)
            }
        },

        watch: {
            newSelectedTab (newSelectedTab) {
                if (newSelectedTab !== this.selectedTab) {
                    this.selectedTab = newSelectedTab
                }
            }
        }
    }
</script>
