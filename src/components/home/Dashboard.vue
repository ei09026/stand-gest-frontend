<template>
    <div class="welcome-container">
        <h1
            v-text="$i18n.t('general.welcome')"></h1>
        <h2
            v-text="config.app_name"></h2>
    </div>    
</template>

<script>
    import config from '@/configs/app.config'

    export default {
        components: {
        },

        data () {
            return {
                config
            }
        }
    }
</script>

<style>
    .dashboard-page .welcome-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
