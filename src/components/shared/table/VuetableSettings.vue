<template>
    <div>
        <div class="ibox-tools">
            <span 
                @click="showModal">
                <i class="fa fa-wrench"></i>
            </span>
        </div>

        <vuetable-settings-maintenance
            :show="showMaintenanceModal"
            :table-slug="tableSlug"
            @saved="saved($event)"
            @canceled="canceled"
            @close="close">
        </vuetable-settings-maintenance>
    </div>                
</template>

<script>
    import VuetableSettingsMaintenance from '@/components/shared/table/VuetableSettingsMaintenance'
    
    export default {
        components: {
            VuetableSettingsMaintenance
        },

        props: {
            tableSlug: {
                type: String,
                required: true
            }
        },

        data () {
            return {
                showMaintenanceModal: false
            }
        },

        methods: {
            showModal () {
                this.showMaintenanceModal = true
            },

            saved (fields) {
                this.$emit('saved')
                this.showMaintenanceModal = false
            },

            canceled () {
                this.showMaintenanceModal = false
            },

            close () {
                this.showMaintenanceModal = false
            }
        },

        created () {
        }
    }
</script>
<style>
    .ibox-tools span {
        cursor: pointer;
        margin-left: 5px;
        color: #c4c4c4;
    }
</style>