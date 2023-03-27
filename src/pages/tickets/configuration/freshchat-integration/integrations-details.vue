<template>
    <div>
        <div class="container">
            <div class="heading-container">
                <div class="heading">
                    <span class="sub-heading">Integration</span>
                    <p class="decs">Freshchat configuration for enable a chat support</p>
                </div>
                <div class="btn-container">
                    <nitrozen-button
                        class="integrate-btn"
                        v-flat-btn
                        :rounded="false"
                        :theme="'secondary'"
                        @click="save()"
                    >
                        Save
                    </nitrozen-button>
                </div>
            </div>
            <div class="url-field">
                <div class="input-field">
                    <nitrozen-input
                        class="host-url"
                        label="Host URL"
                        v-model="integrationsData.configuration.host"
                        :disabled="!integrationsData.is_enable"
                        ></nitrozen-input>
                    <div
                        title="Click to copy"
                        class="copy"
                        @click.stop="copiedUrl"
                        ref="host-url-copy"
                    >
                        <inline-svg src="copy-icon"></inline-svg>
                    </div>
                </div>
                <div class="link-container">
                    <!-- <span class="web-decs"
                        >We've generated a custom webhook URL to get an updates
                        of ticket.
                    </span> -->
                </div>
                <div class="input-field">
                    <nitrozen-input
                        class="api-key"
                        label="App Token"
                        v-model="integrationsData.configuration.token"
                        :disabled="!integrationsData.is_enable"
                    ></nitrozen-input>
                    <div
                        title="Click to copy"
                        class="copy"
                        @click.stop="copiedApiKey"
                        ref="api-key-copy"
                    >
                        <inline-svg src="copy-icon"></inline-svg>
                    </div>
                </div>
                <div class="input-field">
                    <nitrozen-input
                        class="api-key"
                        label="Site ID"
                        v-model="integrationsData.configuration.siteId"
                        :disabled="!integrationsData.is_enable"
                    ></nitrozen-input>
                    <div
                        title="Click to copy"
                        class="copy"
                        @click.stop="copiedSiteIdKey"
                        ref="siteId-copy"
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

export default {
    name: 'integrations-details',
    props: ['token', 'siteId', 'host', 'integrationsData'],

    components: {
        PageHeader,
        NitrozenButton,
        NitrozenInput,
        'inline-svg': inlineSvgVue,
    },
    methods: {
        save(){
            this.$emit('integration')
        },
        copiedUrl(){
            copyToClipboard(this.integrationsData.configuration.host);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        },
        copiedApiKey() {
            copyToClipboard(this.integrationsData.configuration.token);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        },
        copiedSiteIdKey() {
            copyToClipboard(this.integrationsData.configuration.siteId);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        },
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
