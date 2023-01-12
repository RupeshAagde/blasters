<template>
    <div>
        <div class="container">
            <div class="heading-container">
                <div class="heading">
                    <span class="sub-heading">Ticket Update Webhook</span>
                    <p class="decs">Webhook configuration for receiving a payload whenever there is an activity in a ticket</p>
                </div>
                <div class="btn-container">
                    <nitrozen-button
                        class="integrate-btn"
                        v-flat-btn
                        :rounded="false"
                        :theme="'secondary'"
                        @click="integrate()"
                    >
                        Integrate
                    </nitrozen-button>
                </div>
            </div>
            <div class="url-field">
                <div class="input-field">
                    <nitrozen-input
                        class="webhook-url"
                        label="Webhook URL"
                        v-model="webhookUrl"
                        :disabled = true
                        ></nitrozen-input>
                    <div
                        title="Click to copy"
                        class="copy"
                        @click.stop="copiedWebhookUrl"
                    >
                        <inline-svg src="copy-icon"></inline-svg>
                    </div>
                </div>
                <div class="link-container">
                    <span class="web-decs"
                        >We've generated a custom webhook URL to get an updates
                        of ticket.
                    </span>
                </div>
                <div class="input-field">
                    <nitrozen-input
                        class="api-key"
                        label="API Key"
                        v-model="webhookApikey"
                        :disabled = true
                    ></nitrozen-input>
                    <div
                        title="Click to copy"
                        class="copy"
                        @click.stop="copiedWebhookApiKey"
                    >
                        <inline-svg src="copy-icon"></inline-svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { PageHeader } from '@/components/common';
import {
    NitrozenButton,
    NitrozenInput
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import { copyToClipboard } from './../../../../helper/utils.js';
import SupportService from '../../../../services/support.service';

export default {
    name: 'Webhook',
    props: ['type','webhookUrl','webhookApikey'],

    components: {
        PageHeader,
        NitrozenButton,
        NitrozenInput,
        'inline-svg': inlineSvgVue,
    },

    data() {
        return {
            step: 'Webhook',
            link:
                'https://stagingreliance.kapturecrm.com/add-ticket-from-other',
            isIntegrationDisable: true,
            isIntegrated: false,
        };
    },
    mounted() {
    },
    methods: {
        async integrate() {
            this.isIntegrated = true;
            this.$emit('integration', this.isIntegrated, this.step);
            // let body = {
            //     webhook_url: this.webhookUrl,
            //     webhook_apikey: this.webhookApikey,
            // };
            // await SupportService.updateIntegrationDetails(body,this.type)
            //     .then((response) => {
                    // this.isIntegrated = true;
                    // this.$emit('integration', this.isIntegrated, this.step);
                // })
                // .catch((err) => {
                //     this.$snackbar.global.showError('Test failed');
                // });
        },
        copiedWebhookUrl(){
            copyToClipboard(this.webhookUrl);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        },
        copiedWebhookApiKey() {
            copyToClipboard(this.webhookApikey);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        }
    }
};
</script>

<style lang="less" scoped>
.container {
    .heading-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .heading {
            .sub-heading {
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 600;
                font-size: 16px;
                line-height: 140%;
                color: #41434c;
            }
            .decs {
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 20px;
                color: #9b9b9b;
            }
        }
        .btn-container {
        }
    }
    .url-field {
        margin-top: 16px;
        .link-container {
            margin-top: 8px;
            .web-decs {
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;
                color: #9b9b9b;
                .decs-link {
                    cursor: pointer;
                    color: #2e31be;
                }
            }
        }
    }

    .api-key {
        margin-top: 24px;
    }
}

.input-field {
    position: relative;
    .copy {
        position: absolute;
        right: 16px;
        top: 38px;
        cursor: pointer;
    }
}
</style>
