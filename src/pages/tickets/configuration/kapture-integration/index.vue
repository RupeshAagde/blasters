<template>
    <div class="panel">
        <page-header
            title="Kapture Integration"
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
            <div class="kapture-logo">
                <inline-svg
                    class="kapture_logo"
                    :src="'kapture_logo'"
                ></inline-svg>
            </div>
            <div class="container">
                <div class="stepper-container">
                    <div
                        :class="
                            step === 'Create_Ticket_API' &&
                                'stepper-block-active'
                        "
                        class="stepper-block"
                        @click="switchComp('Create_Ticket_API')"
                    >
                        <div
                            v-if="step === 'Create_Ticket_API'"
                            class="side-bar"
                        >
                            <inline-svg :src="'vertical-bar'"></inline-svg>
                        </div>
                        <div class="stepper-title">
                            <div class="img-indicators">
                                <inline-svg
                                    v-if="step === 'Create_Ticket_API'"
                                    :src="'one-blue'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="
                                        step !== 'Create_Ticket_API' &&
                                            fulfillment.Create_Ticket_API
                                                .is_completed
                                    "
                                    :src="'done-check'"
                                ></inline-svg>
                            </div>
                            <div class="step-name-block">
                                <span class="step-name">
                                    Create Ticket API
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        class="stepper-block"
                        :class="
                            step === 'Update_Ticket_API' &&
                                'stepper-block-active'
                        "
                        @click="
                            fulfillment.Create_Ticket_API.is_completed
                                ? switchComp('Update_Ticket_API')
                                : null
                        "
                    >
                        <div
                            v-if="step === 'Update_Ticket_API'"
                            class="side-bar"
                        >
                            <inline-svg :src="'vertical-bar'"></inline-svg>
                        </div>
                        <div class="stepper-title">
                            <div class="img-indicators">
                                <inline-svg
                                    v-if="
                                        step !== 'Update_Ticket_API' &&
                                            !fulfillment.Update_Ticket_API
                                                .is_completed
                                    "
                                    :src="'two-grey'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="step === 'Update_Ticket_API'"
                                    :src="'two-blue'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="
                                        step !== 'Update_Ticket_API' &&
                                            fulfillment.Update_Ticket_API
                                                .is_completed
                                    "
                                    :src="'done-check'"
                                ></inline-svg>
                            </div>
                            <div class="step-name-block">
                                <span class="step-name">
                                    Update Ticket API
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
                            fulfillment.Update_Ticket_API.is_completed
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
                                    :src="'three-grey'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="step === 'Category_Mapping'"
                                    :src="'three-blue'"
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
                                    :src="'four-grey'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="step === 'Webhook'"
                                    :src="'four-blue'"
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
                                    :src="'five-grey'"
                                ></inline-svg>
                                <inline-svg
                                    v-if="step === 'Ticket_Setting'"
                                    :src="'five-blue'"
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
                    <div
                        v-if="
                            step === 'Create_Ticket_API'
                        "
                    >
                        <createTicketAPI
                            :type="integrationType"
                            :baseUrl="baseUrl"
                            :createTicketApikey="createTicketApikey"
                            :id="kapture_Id"
                            :isReconfigure="
                                fulfillment.Create_Ticket_API.is_completed
                            "
                            @integration="setIntegration($event, step)"
                        />
                    </div>

                    <div
                        v-if="
                            step === 'Update_Ticket_API'
                        "
                    >
                        <updateTicketApi
                            :type="integrationType"
                            :updatedApiKey="updatedApiKey"
                            :isReconfigure="
                                fulfillment.Update_Ticket_API.is_completed
                            "
                            @integration="setIntegration($event, step)"
                        />
                    </div>
                    <div
                        v-if="
                            step === 'Category_Mapping'
                        "
                    >
                        <categoryMapping
                            :type="integrationType"
                            :categorySyncApikey="categorySyncApikey"
                            :categoryData="categoryData"
                            :isReconfigure="
                                fulfillment.Category_Mapping.is_completed
                            "
                            @integration="setIntegration($event, step)"
                        />
                    </div>
                    <div
                        v-if="
                            step === 'Webhook'
                        "
                    >
                        <webhook
                            :type="integrationType"
                            :webhookApikey="webhookApikey"
                            :webhookUrl="webhookUrl"
                            @integration="setIntegration($event, step)"
                        />
                    </div>
                    <div
                        v-if="
                            step === 'Ticket_Setting'
                        "
                    >
                        <ticketSetting
                            :type="integrationType"
                            :saveDetails="saveDetail"
                            :allowToAddTicket="allowToAddTickets"
                            :allowToShowListing="allowToShowListings"
                            @addTicketToggle="setAddTicketValue($event)"
                            @ticketListingToggle="setTicketListingValue($event)"
                            @integration="setIntegration($event, step)"
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
import createTicketAPI from './create-ticket-api.vue';
import updateTicketApi from './update-ticket-api.vue';
import categoryMapping from './category-mapping.vue';
import ticketSetting from './ticket-setting.vue';
import webhook from './webhook.vue';
import SupportService from '../../../../services/support.service';

export default {
    name: 'index',
    components: {
        PageHeader,
        NitrozenButton,
        NitrozenInput,
        'inline-svg': inlineSvgVue,
        createTicketAPI,
        updateTicketApi,
        categoryMapping,
        ticketSetting,
        webhook
    },
    data() {
        return {
            step: 'Create_Ticket_API',
            fulfillment: {
                Create_Ticket_API: { is_completed: false },
                Update_Ticket_API: { is_completed: false },
                Category_Mapping: { is_completed: false },
                Webhook: { is_completed: false },
                Ticket_Setting: { is_completed: false }
            },
            isSavebtnDisable: true,
            saveDetail: false,

            allowToAddTickets: false,
            allowToShowListings: false,
            webhookUrl: '',
            baseUrl: '',
            createTicketApikey: '',
            updatedApiKey: '',
            categorySyncApikey: '',
            categoryData: {},
            configCompleted: false,
            webhookApikey: '',
            kapture_Id: '',
            generalConfigurationID: '',
            integrationType: 'kapture'
        };
    },
    mounted() {
        this.getKaptureDetails();
    },
    methods: {
        getKaptureDetails() {
            SupportService.getIntegrationDetails(this.integrationType)
                .then((response) => {
                    this.kapture_Id = response.data._id;
                    this.createTicketApikey =
                        response.data.create_ticket_apikey;
                    this.updatedApiKey =
                        response.data.update_ticket_apikey;
                    this.categorySyncApikey =
                        response.data.category_sync_apikey;
                    this.categoryData = response.data.category_data;
                    this.configCompleted = response.data.config_completed;
                    this.webhookUrl = response.data.webhook_url;
                    this.webhookApikey = response.data.webhook_apikey;
                    this.baseUrl = response.data.base_url;
                    this.allowToAddTickets = response.data.allow_ticket_creation;
                    this.allowToShowListings = response.data.show_listing;

                    this.completedStep();
                })
                .catch((err) => {
                });
        },
        completedStep() {
            if (this.createTicketApikey && this.baseUrl) {
                this.step = 'Update_Ticket_API';
                this.fulfillment.Create_Ticket_API.is_completed = true;
                if (this.updatedApiKey) {
                    this.step = 'Category_Mapping';
                    this.fulfillment.Update_Ticket_API.is_completed = true;
                    if (this.categorySyncApikey && this.categoryData) {
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
            }
        },
        switchComp(step) {
            return (this.step = step);
        },
        setIntegration(value, steps) {
            switch (steps) {
                case 'Create_Ticket_API':
                    (this.step = 'Update_Ticket_API'),
                        (this.fulfillment.Create_Ticket_API.is_completed = value);
                    break;
                case 'Update_Ticket_API':
                    (this.step = 'Category_Mapping'),
                        (this.fulfillment.Update_Ticket_API.is_completed = value);
                    break;
                case 'Category_Mapping':
                    (this.step = 'Webhook'),
                        (this.fulfillment.Category_Mapping.is_completed = value);
                    break;
                case 'Webhook':
                    (this.step = 'Ticket_Setting'),
                        (this.fulfillment.Webhook.is_completed = value);
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
        //         this.integrationType
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
    // padding: 24px;
    border-radius: 12px;
    top: 77px;
    background: #ffffff;
    border-radius: 12px;

    .kapture-logo {
        padding: 24px;
        border-bottom: 1px solid #e0e0e0;
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

::v-deep .kapture-logo .inline-svg {
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
