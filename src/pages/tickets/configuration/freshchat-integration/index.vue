<template>
    <div class="panel">
        <page-header
            title="Freshchat Integration"
            :showBackButton="true"
            :noContextMenu="true"
            @backClick="
                $router.push({
                    path: '/administrator/settings/partners/contact-configuration'
                })
            "
        >
        </page-header>

        <div class="main-container">
            <div class="freshdesk-logo">
                <inline-svg
                    class="freshdesk_logo"
                    :src="'freshchat_icon'"
                ></inline-svg>
                <span class="freschat-heading"> Freshchat </span>
            </div>
            <div class="container">
                <div class="stepper-container">
                    <div
                        :class="
                            step === 'Api_Key_Integration' &&
                                'stepper-block-active'
                        "
                        class="stepper-block"
                    >
                        <div
                            v-if="step === 'Api_Key_Integration'"
                            class="side-bar"
                        >
                            <inline-svg :src="'vertical-bar'"></inline-svg>
                        </div>
                        <div class="stepper-title">
                            <div class="img-indicators">
                                <inline-svg
                                    v-if="step === 'Api_Key_Integration'"
                                    :src="'one-blue'"
                                ></inline-svg>
                                <!-- <inline-svg
                                    v-if="
                                        step !== 'Api_Key_Integration' &&
                                            fulfillment.Api_Key_Integration
                                                .is_completed
                                    "
                                    :src="'done-check'"
                                ></inline-svg> -->
                            </div>
                            <div class="step-name-block">
                                <span class="step-name">
                                    Integration
                                </span>
                            </div>
                        </div>
                    </div>
                   
                </div>
                <div class="right-container">
                    <div v-if="step === 'Api_Key_Integration'">
                        <integrationsDetails
                            :token="token"
                            :siteId="siteId"
                            :host="host"
                            :integrationsData="integrationsData"
                            @integration="setIntegration($event)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { PageHeader } from '@/components/common';
import { NitrozenButton, NitrozenInput } from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import integrationsDetails from './integrations-details.vue';
import CredentialsService from '@/services/support-credentials.service.js'

export default {
    name: 'index',
    components: {
        PageHeader,
        NitrozenButton,
        NitrozenInput,
        'inline-svg': inlineSvgVue,
        integrationsDetails
    },
    data() {
        return {
            step: 'Api_Key_Integration',
            token: '',
            siteId: '',
            host: '',
            integrationsData: null
        };
    },
    mounted() {
        this.getfreshchatDetails();
    },
    methods: {
        setPageData(response){
            const { configuration: { token, siteId, host } } = response
            this.integrationsData = response
            this.token = token;
            this.siteId = siteId;
            this.host = host;
        },
        async getfreshchatDetails() {
            const { data: { items } } = await CredentialsService.fetchCredential('partner', "freshchat")
            this.setPageData(items[0]);
        },
        async setIntegration() {
            let id = this.integrationsData._id
            let payload = this.integrationsData
            const { data: { items } } = await CredentialsService.updateCredential(id, payload)
            if(items){
                this.setPageData(items);
                this.$router.push({
                    path: `/administrator/settings/partners/contact-configuration`
                });
            }
        },
    }
};
</script>

<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
    .save-btn {
        height: 40px;
        width: 102px;
    }
}
.main-container {
    position: relative;
    margin: 24px;
    border-radius: 12px;
    top: 77px;
    background: #ffffff;

    .freshdesk-logo {
        padding: 24px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        .freshdesk-heading {
            // background: #4D4D4D;
        }
    }

    .container {
        display: flex;
        width: 100%;
        .stepper-container {
            border-right: 1px solid #e0e0e0;
            width: 24%;
        }
        .right-container {
            margin: 24px;
            width: 76%;
        }
    }
}

::v-deep .nitrozen-input-grp {
    margin-top: 8px;
}

::v-deep .freshdesk-logo .inline-svg {
    justify-content: start;
}

::v-deep.page-header {
    height: 77px;
}

.stepper-comp-cont {
    display: flex;
}
.stepper-block {
    display: flex;
    cursor: pointer;
    .step-name-block {
        display: flex;
        align-items: center;
    }
}
.stepper-block-active {
    background: #f5f8ff;
}
.img-indicators {
    display: flex;
    align-items: center;
    margin-right: 12px;
}
.stepper-title {
    display: flex;
    padding: 16px;
}
</style>
