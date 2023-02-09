<template>
    <div>
        <div class="container">
            <div class="heading-container">
                <div class="heading">
                    <span
                        v-if="type === 'kapture'"
                        class="sub-heading"
                        >Create Ticket API</span
                    >
                    <span v-else class="sub-heading">Integration</span>
                    <p v-if="type === 'kapture'" class="decs">This will facilitate the creation of ticket on Kapture</p>
                    <p v-else class="decs">Freshdesk provides you the below details to integrate</p>
                </div>
                <div class="btn-container">
                    <nitrozen-button
                        v-if="!isTested"
                        class="test-btn"
                        v-stroke-btn
                        :rounded="false"
                        :theme="'secondary'"
                        :disabled="false"
                        @click="test()"
                    >
                        Test
                    </nitrozen-button>
                    <nitrozen-button
                        v-if="!isIntegrated"
                        class="integrate-btn"
                        v-flat-btn
                        :rounded="false"
                        :theme="'secondary'"
                        :disabled="isIntegrationDisable"
                        @click="integrate()"
                    >
                        Integrate
                    </nitrozen-button>
                    <nitrozen-button
                        v-if="isReconfigure"
                        class="test-btn"
                        v-stroke-btn
                        :rounded="false"
                        :theme="'secondary'"
                        :disabled="false"
                        @click="reconfigure()"
                    >
                        Reconfigure
                    </nitrozen-button>
                </div>
            </div>
            <div class="url-field">
                <nitrozen-input
                    class="base-url"
                    label="Base URL*"
                    v-model="baseUrl"
                ></nitrozen-input>
                <nitrozen-error
                    class="error"
                    :style="{
                        visibility:
                            baseUrl && (!checkUrl(baseUrl) || checkUrl(baseUrl))
                    }"
                    ><div v-if="baseUrl" class="link-container">
                        <div class="link-icon">
                            <inline-svg
                                v-if="validateUrl"
                                :src="'check-circle'"
                            ></inline-svg>
                            <inline-svg
                                v-else
                                :src="'red-warning-icon'"
                            ></inline-svg>
                            <span v-if="validateUrl" class="link">{{ baseUrl }}</span>
                            <span v-else class="link">Invalid Url</span>
                        </div>
                    </div></nitrozen-error
                >
                <nitrozen-input
                    class="api-key"
                    label="API Key*"
                    v-model="createTicketApikey"
                ></nitrozen-input>
            </div>
            <pop-up
                v-if="warningPopUp"
                :infoText="popupDecs"
                :textHeading="popupHeading"
                @cancel="warningPopUp = !warningPopUp"
                @confirm="confirmPopUp"
            />
        </div>
    </div>
</template>

<script>
import { PageHeader } from '@/components/common';
import PopUp from '../common/PopUp.vue';
import { NitrozenButton, NitrozenInput, NitrozenError } from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SupportService from '../../../../services/support.service';

export default {
    name: 'Create_Ticket_API',
    props: ['type', 'id', 'baseUrl', 'createTicketApikey', 'isReconfigure'],
    components: {
        PageHeader,
        NitrozenButton,
        NitrozenInput,
        NitrozenError,
        'inline-svg': inlineSvgVue,
        'pop-up': PopUp
    },

    data() {
        return {
            step: 'Create_Ticket_API',
            link:
                'https://stagingreliance.kapturecrm.com/add-ticket-from-otheraaaa',
            isTested: false,
            isIntegrationDisable: true,
            isIntegrated: false,
            warningPopUp: false,
            popupDecs: '',
            popupHeading: '',
            validateUrl: false
        };
    },
    mounted() {
        if (this.isReconfigure) {
            this.isTested = true;
            this.isIntegrated = true;
        }
        this.checkUrl(this.baseUrl);
    },
    methods: {
        checkUrl(str) {
            if (str !== '') {
                let pattern = new RegExp(
                    '((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)'
                );
                if (pattern.test(str)) {
                    return (this.validateUrl = true);
                }
                return (this.validateUrl = false);
            }
        },
        test() {
            const body = {
                apikey: this.createTicketApikey,
                baseUrl: this.baseUrl
            };
            SupportService.testApiKey(body, this.type)
                .then((response) => {
                    this.isTested = true;
                    this.isIntegrationDisable = false;
                    this.$snackbar.global.showSuccess(
                        `Test successful | Ticket Created: ${this.createTicketApikey}`,
                        1000
                    );
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Test failed');
                });
        },
        async integrate() {
            if (!this.createTicketApikey)
                return this.$snackbar.global.showError('Invalid details');
            let body = {
                create_ticket_apikey: this.createTicketApikey,
                base_url: this.baseUrl
            };
            if (this.type === 'freshdesk') {
                body = {
                    create_ticket_apikey: this.createTicketApikey,
                    update_ticket_apikey: this.createTicketApikey,
                    base_url: this.baseUrl
                };
            }
            if (this.id) {
                return await SupportService.updateIntegrationDetails(
                    body,
                    this.type
                )
                    .then((response) => {
                        this.isIntegrated = true;
                        this.$emit('integration', this.isIntegrated, this.step);
                        this.$emit('updatedData', response);
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(
                            'Fail to update kapture details'
                        );
                    });
            }
            return await SupportService.createIntegration(body, this.type)
                .then((response) => {
                    this.id = response.data._id;
                    this.isIntegrated = true;
                    this.$emit('integration', this.isIntegrated, this.step);
                    this.$emit('updatedData', response);
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Fail to create ${this.type}`
                    );
                });
        },
        reconfigure() {
            this.warningPopUp = true;
            this.popupHeading = `Are you sure?`;
            this.popupDecs = `It is a working pipeline with ${this.type}. If you update the configuration, It may affect the integration.`;
        },
        confirmPopUp() {
            this.warningPopUp = false;
            this.isReconfigure = false;
            this.isTested = false;
            this.isIntegrated = false;
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
            .test-btn {
                margin-right: 16px;
            }
        }
    }
    .url-field {
        margin-top: 16px;
        .link-container {
            display: flex;
            margin-top: 6px;
            .link-icon {
                display: flex;
                align-items: center;
            }
            .link {
                margin-left: 8px;
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                line-height: 24px;
                color: #9b9b9b;
            }
        }
    }

    .api-key {
        margin-top: 24px;
    }
}
::v-deep
    button.n-button.ripple.test-btn.n-button-secondary.n-button-stroke.n-button-stroke-secondary {
    min-width: 120px;
}
</style>
