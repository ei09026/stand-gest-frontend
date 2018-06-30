<template>
    <div>
        <page-header
            :active-title="title">
        </page-header>

        <template>
            <table>
                <thead>
                    <th>Image</th>
                </thead>
                <tr
                    v-for="item in images"
                    v-bind:key="item.id"
                >
                    <td>
                        <img :src="item.data" width="30%">
                    </td>
                </tr>
            </table>
        </template>
    </div>
</template>

<script>
    import PageHeader from '@/components/layout/PageHeader'
    import siganlR from '@/services/signalr/signalr.service'
    // import uuidv1 from 'uuid/v1';

    export default {
        // directives: {
        //     tooltip
        // },

        components: {
            PageHeader
        },

        data () {
            return {
                title: 'Testes',
                binaryHub: siganlR.hubs.binary,
                images: []
            }
        },

        methods: {
            bindBinaryHubEvents () {
                this.binaryHub.connection.on('ReceiveImage', data => {
                    console.log('Image received successfully.')

                    this.images.push({ guid: data.guid, data: 'data:image/jpg;base64,' + data.imageBinary })
                })
            }
        },

        created () {
           // this.bindBinaryHubEvents()
        }
    }

</script>
