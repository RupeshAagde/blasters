<template>
    <div>
        <div>
            <div class="panel">
                <div class="main-container api-container">
                    <adm-jumbotron
                        class="jumbotron-h"
                        :title="`APIs & SDKs`"
                        :desc="jumbotronData"
                        :btnLabel="'Create Client'"
                        @btnClick="newClient"
                    ></adm-jumbotron>
                    <div class="width-100">
                        <oauth-client-view />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import './../less/page-header.less';

.main-container {
    padding: 24px;
    flex-wrap: wrap;
    background: @White;
    .jumbotron-h {
        box-sizing: border-box;
        min-height: 263px;
        flex: 0 100%;
        @media @mobile {
            min-height: initial;
        }
    }
    .group-tab {
        margin-top: 24px;
    }
    .width-100 {
        width: 100%;
    }

    ::v-deep .nitrozen-tab-item {
        padding-bottom: 16px;
    }
}
</style>

<script>
import admJumbotron from '@/components/common/adm-jumbotron.vue';
import oAuthClientView from '@/pages/oauth-clients/oauthclient.vue';
const JUMBOTRON_DATA = `Use this section to utilize platform APIs and SDKs that allow you to create systems and develop applications. Avail platform APIs to get data related to your e-commerce business. Moreover, you also get reusable SDK methods that support different programming languages.`;

export default {
    name: 'adm-oauth-clients',
    components: {
        'adm-jumbotron': admJumbotron,
        'oauth-client-view': oAuthClientView,
    },
    data() {
        return {
            jumbotronData: JUMBOTRON_DATA,
        };
    },
    methods: {
        newClient() {
            this.$router.push({ name: 'create-oauth-client' });
        },
    },
};
</script>
