<template>
    <div class="panel">
        <page-header
            title="Freshdesk Integration"
            :showBackButton="true"
            :noContextMenu="true"
            @backClick="
                $router.push({
                    path: '/administrator/support/configuration'
                })
            "
        >
            <!-- <div class="save-btn">
                <nitrozen-button
                    class="save-btn"
                    v-flat-btn
                    :rounded="false"
                    :theme="'secondary'"
                    :disabled="isSavebtnDisable"
                    @click="save()"
                >
                    Save
                </nitrozen-button>
            </div> -->
        </page-header>

        <div class="main-container">
            <div class="freshdesk-logo">
                <inline-svg
                    class="freshdesk_logo"
                    :src="'freshdesk-logo'"
                ></inline-svg>
                <!-- <span class="freshdesk-heading"> freshdesk </span> -->
            </div>
            <div class="container">
                <div class="stepper-container">
                    <div
                        :class="
                            step === 'Api_Key_Integration' &&
                                'stepper-block-active'
                        "
                        class="stepper-block"
                        @click="switchComp('Api_Key_Integration')"
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
                                <inline-svg
                                    v-if="
                                        step !== 'Api_Key_Integration' &&
                                            fulfillment.Api_Key_Integration
                                                .is_completed
                                    "
                                    :src="'done-check'"
                                ></inline-svg>
                            </div>
                            <div class="step-name-block">
                                <span class="step-name">
                                    Integration
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        :class="
                            step === 'Category_Mapping' &&
                                'stepper-block-active'
                        "
                        class="stepper-block"
                        @click="
                            fulfillment.Api_Key_Integration.is_completed
                                ? switchComp('Category_Mapping')
                                : null
                        "
                    >
                        <div
                            v-if="step === 'Category_Mapping'"
                            class="side-bar"
                        >
                            <inline-svg :src="'vertical-bar'"></inline-svg>
                        </div>
                        <div class="stepper-title">
                            <div class="img-indicators">
                                <inline-svg
                                    v-if="
                                        step !== 'Category_Mapping' &&
                                            !fulfillment.Category_Mapping
                                                .is_completed
                                    "
                                    :src="'two-grey'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="step === 'Category_Mapping'"
                                    :src="'two-blue'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="
                                        step !== 'Category_Mapping' &&
                                            fulfillment.Category_Mapping
                                                .is_completed
                                    "
                                    :src="'done-check'"
                                ></inline-svg>
                            </div>
                            <div class="step-name-block">
                                <span class="step-name">
                                    Category Mapping
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        :class="step === 'Webhook' && 'stepper-block-active'"
                        class="stepper-block"
                        @click="
                            fulfillment.Category_Mapping.is_completed
                                ? switchComp('Webhook')
                                : null
                        "
                    >
                        <div>
                            <inline-svg
                                v-if="step === 'Webhook'"
                                :src="'vertical-bar'"
                            ></inline-svg>
                        </div>
                        <div class="stepper-title">
                            <div class="img-indicators">
                                <inline-svg
                                    v-if="
                                        step !== 'Webhook' &&
                                            !fulfillment.Webhook.is_completed
                                    "
                                    :src="'three-grey'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="step === 'Webhook'"
                                    :src="'three-blue'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="
                                        step !== 'Webhook' &&
                                            fulfillment.Webhook.is_completed
                                    "
                                    :src="'done-check'"
                                ></inline-svg>
                            </div>
                            <div class="step-name-block">
                                <span class="step-name"> Webhook </span>
                            </div>
                        </div>
                    </div>
                    <div
                        :class="
                            step === 'Ticket_Setting' && 'stepper-block-active'
                        "
                        class="stepper-block"
                        @click="
                            fulfillment.Webhook.is_completed
                                ? switchComp('Ticket_Setting')
                                : null
                        "
                    >
                        <div v-if="step === 'Ticket_Setting'" class="side-bar">
                            <inline-svg :src="'vertical-bar'"></inline-svg>
                        </div>
                        <div class="stepper-title">
                            <div class="img-indicators">
                                <inline-svg
                                    v-if="
                                        step !== 'Ticket_Setting' &&
                                            !fulfillment.Ticket_Setting
                                                .is_completed
                                    "
                                    :src="'four-grey'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="step === 'Ticket_Setting'"
                                    :src="'four-blue'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="
                                        step !== 'Ticket_Setting' &&
                                            fulfillment.Ticket_Setting
                                                .is_completed
                                    "
                                    :src="'done-check'"
                                ></inline-svg>
                            </div>
                            <div class="step-name-block">
                                <span class="step-name"> Ticket Setting </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-container">
                    <div v-if="step === 'Api_Key_Integration'">
                        <createTicketAPI
                            :type="IntegrationType"
                            :baseUrl="baseUrl"
                            :createTicketApikey="freshdeskApiKey"
                            :id="freshdesk_Id"
                            :isReconfigure="
                                fulfillment.Api_Key_Integration.is_completed
                            "
                            @integration="setIntegration($event, step)"
                            @updatedData="setPageData($event,response)"
                        />
                    </div>
                    <div v-if="step === 'Category_Mapping'">
                        <categoryMapping
                            :type="IntegrationType"
                            :id="freshdesk_Id"
                            :categoryList="categoryData"
                            @integration="setIntegration($event, step)"
                            @updatedData="setPageData($event,response)"
                        />
                        <!-- :isReconfigure="
                            fulfillment.Category_Mapping.is_completed
                        " -->
                    </div>
                    <div v-if="step === 'Webhook'">
                        <webhook
                            :type="IntegrationType"
                            :webhookApikey="webhookApikey"
                            :webhookUrl="webhookUrl"
                            @integration="setIntegration($event, step)"
                        />
                    </div>
                    <div v-if="step === 'Ticket_Setting'">
                        <ticketSetting
                            :type="IntegrationType"
                            :saveDetails="saveDetail"
                            :allowToAddTicket="allowToAddTickets"
                            :allowToShowListing="allowToShowListings"
                            @addTicketToggle="setAddTicketValue($event)"
                            @ticketListingToggle="setTicketListingValue($event)"
                            @integration="setIntegration($event, step,response)"
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
import createTicketAPI from '../kapture-integration/create-ticket-api.vue';
import ticketSetting from '../kapture-integration/ticket-setting.vue';
import webhook from '../kapture-integration/webhook.vue';
import categoryMapping from '@/pages/tickets/configuration/freshdesk-integration/freshdesk-category-mapping.vue';
import SupportService from '../../../../services/support.service';

export default {
    name: 'index',
    components: {
        PageHeader,
        NitrozenButton,
        NitrozenInput,
        'inline-svg': inlineSvgVue,
        createTicketAPI,
        categoryMapping,
        ticketSetting,
        webhook
    },
    data() {
        return {
            step: 'Api_Key_Integration',
            fulfillment: {
                Api_Key_Integration: { is_completed: false },
                Category_Mapping: { is_completed: false },
                Webhook: { is_completed: false },
                Ticket_Setting: { is_completed: false }
            },
            isSavebtnDisable: true,
            saveDetail: false,
            IntegrationType: 'freshdesk',

            allowToAddTickets: false,
            allowToShowListings: false,
            webhookUrl: '',
            baseUrl: '',
            freshdeskApiKey: '',
            categoryData: [],
            configCompleted: false,
            webhookApikey: '',
            freshdesk_Id: '',
            generalConfigurationID: '',
        };
    },
    mounted() {
        this.getfreshdeskDetails();
    },
    methods: {
        setPageData(response){
                    this.freshdesk_Id = response.data._id;
                    this.freshdeskApiKey =
                        response.data.create_ticket_apikey;
                    this.allowToAddTickets =
                        response.data.allow_ticket_creation;
                    this.allowToShowListings = response.data.show_listing;
                    this.categoryData = response.data.category_data
                        ? response.data.category_data.list
                        : [];
                    this.configCompleted = response.data.config_completed;
                    this.webhookUrl = response.data.webhook_url;
                    this.webhookApikey = response.data.webhook_apikey;
                    this.baseUrl = response.data.base_url;
        },
        getfreshdeskDetails() {
            SupportService.getIntegrationDetails(this.IntegrationType)
                .then((response) => {
                    this.setPageData(response);
                    // this.freshdesk_Id = response.data.items._id;
                    // this.freshdeskApiKey =
                    //     response.data.items.create_ticket_apikey;
                    // this.allowToAddTickets =
                    //     response.data.items.allow_ticket_creation;
                    // this.allowToShowListings = response.data.items.show_listing;
                    // this.categoryData = response.data.items.category_data
                    //     ? response.data.items.category_data.list
                    //     : [];
                    // this.configCompleted = response.data.items.config_completed;
                    // this.webhookUrl = response.data.items.webhook_url;
                    // this.webhookApikey = response.data.items.webhook_apikey;
                    // this.baseUrl = response.data.items.base_url;
                    this.completedStep();
                })
                .catch((err) => {
                });
        },
        completedStep() {
            if (this.freshdeskApiKey && this.baseUrl) {
                this.step = 'Category_Mapping';
                this.fulfillment.Api_Key_Integration.is_completed = true;
                if (this.categoryData.length) {
                    this.step = 'Webhook';
                    this.fulfillment.Category_Mapping.is_completed = true;
                    if (this.webhookUrl && this.webhookApikey) {
                        this.step = 'Ticket_Setting';
                        this.fulfillment.Webhook.is_completed = true;
                        this.fulfillment.Ticket_Setting.is_completed = true;
                        this.isSavebtnDisable = false;
                    }
                }
            }
        },
        switchComp(step) {
            return (this.step = step);
        },
        setIntegration(value, steps) {
            switch (steps) {
                case 'Api_Key_Integration':
                    (this.step = 'Category_Mapping'),
                        (this.fulfillment.Api_Key_Integration.is_completed = value);
                    break;
                case 'Category_Mapping':
                    (this.step = 'Webhook'),
                        (this.fulfillment.Category_Mapping.is_completed = value);
                    break;
                case 'Webhook':
                    (this.step = 'Ticket_Setting'),
                        (this.fulfillment.Webhook.is_completed = value);
                    this.isSavebtnDisable = false;
                    break;
                case 'Ticket_Setting':
                    this.fulfillment.Ticket_Setting.is_completed = value;
                    break;
            }
        },
        setAddTicketValue(value) {
            this.allowToAddTickets = value;
        },
        setTicketListingValue(value) {
            this.allowToShowListings = value;
        },
        // async save() {
        //     let body = {
        //         allow_ticket_creation: this.allowToAddTickets,
        //         show_listing: this.allowToShowListings
        //     };

        //     await SupportService.updateIntegrationDetails(
        //         body,
        //         this.IntegrationType
        //     )
        //         .then((response) => {
        //             this.$router.push({
        //                 path: `/administrator/support/configuration`
        //             });
        //             this.$snackbar.global.showSuccess(
        //                 'Saved freshdesk Changes'
        //             );
        //         })
        //         .catch((err) => {
        //             this.$snackbar.global.showError('Fail to save');
        //         });
        // }
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
        padding: 0px 24px;
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
