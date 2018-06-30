<template>
    <page
        :active-title="$i18n.t('general.warning')">
        <div class="container">
            <div class="content">
                <div class="title" v-text="$i18n.t('general.unauthorized-page')"></div>
            </div>
        </div>
    </page>
</template>

<script>
    import Page from '@/components/layout/Page'

    export default {
        components: {
            Page
        }
    }
</script>

<style scoped>
    .container {
        text-align: center;
        display: table-cell;
        vertical-align: middle;
    }

    .content {
        text-align: center;
        display: inline-block;
        color: red;
    }

    .title {
        font-size: 40px;
        margin-bottom: 40px;
    }
</style>
