<template>
    <div>
        <div class="container">
            <div class="heading-container">
                <div class="heading">
                    <span class="sub-heading">Ticket Setting</span>
                    <p class="decs">
                        These settings will reflect on the Platform
                    </p>
                </div>
                <div class="save-btn">
                    <nitrozen-button
                        class="save-btn"
                        v-flat-btn
                        :rounded="false"
                        :theme="'secondary'"
                        @click="save()"
                    >
                        Save
                    </nitrozen-button>
                </div>
            </div>
            <div class="toggle-container">
                <div class="label-container">
                    <label class="label"> Add Ticket </label>
                    <nitrozen-tooltip :position="'top'">
                        <span class="tooltip-label"
                            >Show 'Create Ticket' option on Platform</span
                        >
                    </nitrozen-tooltip>
                </div>
                <nitrozen-toggle-btn
                    class="toggle"
                    v-model="allowToAddTicket"
                    @change="setAddTicket"
                ></nitrozen-toggle-btn>
            </div>
            <div class="toggle-container">
                <div class="label-container">
                    <label class="label"> Ticket Listing </label>
                    <nitrozen-tooltip :position="'top'">
                        <span class="tooltip-label"
                            >Show a list of tickets on Platform</span
                        >
                    </nitrozen-tooltip>
                </div>
                <nitrozen-toggle-btn
                    class="toggle"
                    v-model="allowToShowListing"
                    @change="setTicketListing"
                ></nitrozen-toggle-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { PageHeader } from '@/components/common';
import PopUp from '../common/PopUp.vue';
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenToggleBtn,
    NitrozenTooltip
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SupportService from '../../../../services/support.service';

export default {
    name: 'Ticket_Setting',
    props: {
        type: {
            type: String,
            default: ''
        },
        allowToAddTicket: {
            type: Boolean,
            default: true
        },
        allowToShowListing: {
            type: Boolean,
            default: true
        }
    },
    components: {
        PageHeader,
        NitrozenButton,
        NitrozenInput,
        NitrozenTooltip,
        NitrozenToggleBtn,
        'inline-svg': inlineSvgVue,
        'pop-up': PopUp
    },

    data() {
        return {
            step: 'Ticket_Setting'
        };
    },
    mounted() {},
    methods: {
        setAddTicket() {
            this.$emit('addTicketToggle', this.allowToAddTicket);
        },
        setTicketListing() {
            this.$emit('ticketListingToggle', this.allowToShowListing);
        },
        async save() {
            let body = {
                allow_ticket_creation: this.allowToAddTicket,
                show_listing: this.allowToShowListing
            };

            await SupportService.updateIntegrationDetails(body, this.type)
                .then((response) => {
                    this.$router.push({
                        path: `/administrator/support/configuration`
                    });
                    this.$snackbar.global.showSuccess(
                        `Saved ${this.type} Changes`
                    );
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Fail to save');
                });
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
    }
    .toggle-container {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 16px 14px;
        .label-container {
            display: flex;
            align-items: center;
            .label {
                margin-right: 7.5px;
            }
        }
    }
}
</style>
