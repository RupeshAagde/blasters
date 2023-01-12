<template>
    <div>
        <div class="container">
            <div class="heading-container">
                <div class="heading">
                    <span class="sub-heading">Update Ticket API</span>
                    <p class="decs">This will help refresh the details whenever a ticket is updated on Kapture</p>
                </div>
                <div class="btn-container">
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
                        class="reconfigure-btn"
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
                <div class="link-container">
                    <div class="link-icon">
                        <inline-svg :src="'link_icon'"></inline-svg>
                        <span class="link">{{ link }}</span>
                    </div>
                </div>

                <nitrozen-input
                    class="api-key"
                    label="API Key*"
                    v-model="updatedApiKey"
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
import {
    NitrozenButton,
    NitrozenInput
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SupportService from '../../../../services/support.service';

export default {
    name: 'Update_Ticket_API',
    props: ['type','updatedApiKey','isReconfigure'],
    components: {
        PageHeader,
        NitrozenButton,
        NitrozenInput,
        'inline-svg': inlineSvgVue,
        'pop-up': PopUp
    },

    data() {
        return {
            step: 'Update_Ticket_API',
            isIntegrationDisable: false,
            isReconfigure: false,
            isIntegrated: false,
            warningPopUp: false,
            link: 'https://stagingreliance.kapturecrm.com/add-ticket-from-other'
        };
    },
    mounted() {
        if(this.isReconfigure){
            this.isIntegrated =true
        }
    },
    methods: {
        async integrate() {
             if(!this.updatedApiKey) return this.$snackbar.global.showError('Invalid details');
            let body = {
                update_ticket_apikey: this.updatedApiKey,
            };
            return await SupportService.updateIntegrationDetails(body,this.type)
                .then((response) => {
                    this.isIntegrated = true;
                    this.$emit('integration', this.isIntegrated, this.step);
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Test failed');
                });
        },
        reconfigure() {
            this.warningPopUp = true;
            this.popupHeading = `Are you sure?`;
            this.popupDecs = `It is a working pipeline with Kapture. If you update the configuration, It may affect the integration.`;
        },
        confirmPopUp() {
            this.warningPopUp = false;
            this.isReconfigure = false;
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
        }
    }
    .url-field {
        margin-top: 16px;
        .link-container {
            display: flex;
            margin-top: 16px;
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
</style>
