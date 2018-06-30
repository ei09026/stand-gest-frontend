<template>
    <!-- <div class="welcome-container">
        <h1
            v-text="$i18n.t('general.welcome')"></h1>
        <h2
            v-text="config.app_name"></h2>
    </div> -->
    <div>
        <session></session>
    </div>
</template>

<script>
    import config from '@/configs/app.config'
    import Session from '@/components/sessions/Session'

    export default {
        components: {
            Session
        },

        data () {
            return {
                config
            }
        }
    }
</script>

<style>
    /* .dashboard-page {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    } */

    .dashboard-page .welcome-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
