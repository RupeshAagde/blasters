<template>
    <div>
        <div class="collapse-icon" @click="collapseView">
            <span class="collapsable-arrow">
                <ukt-inline-svg src="collapse-icon"></ukt-inline-svg>
            </span>
        </div>
        <!-- <div class="info-section-container" v-if="hasData.length > 0"> -->
        <div class="info-section-container" v-if="hasData">
            <div class="channel-info">
                <div class="channel-details">
                    <div class="title">Channel</div>
                    <div class="content">
                        <div
                            class="img-container"
                            v-if="detailsData.platform_logo"
                        >
                            <img
                                :src="detailsData.platform_logo"
                                class="channel-logo"
                            />
                        </div>
                        <span class="channel-name">
                            {{ detailsData.affiliate_details.company_affiliate_tag }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="order-info info-container">
                <accordion :title="'Order Details'" :initialState="true">
                    <div class="content">
                        <div class="order-id-container">
                            <span
                                class="order-id"
                                @click="
                                    copyOrderId(detailsData.order.fynd_order_id)
                                "
                                >{{ detailsData.order.fynd_order_id }}</span
                            >
                        </div>

                        <div class="sub-info">
                            Placed on {{ created_at }}
                            <p v-if="detailsData.order_source_domain" class="sub-link">
                                via <a :href="`https://${detailsData.order_source_domain}`" target="_blank">
                                    https://{{detailsData.order_source_domain}}
                                    </a> 
                            </p>
                            <!-- need currency symbol in payment value -->

                            <p class="sub-link" v-if="detailsData.order.prices.amount_paid">
                                <b>Order Value:</b> ₹{{ detailsData.order.prices.amount_paid.toFixed(2) }}
                            </p>

                            <div v-if="detailsData.order.meta && detailsData.order.meta.order_tags">
                                <nitrozen-badge
                                    v-for="(tag, index) in detailsData.order
                                        .meta.order_tags"
                                    :key="index"
                                    class="right-align"
                                    :style="{
                                        color: '#E9783D',
                                        'border-color': '#E9783D',
                                        margin: '0px 10px 10px 0px',
                                    }"
                                >
                                    {{ tag.display_text }}
                                </nitrozen-badge>
                            </div>
                            <div v-if="isInternational"> 
                                <nitrozen-badge
                                    :style="{
                                        color: '#E9783D',
                                        'border-color': '#E9783D'
                                    }"
                                >
                                    International
                                </nitrozen-badge>
                            </div>

                            <!-- @TODO: TBD -->
                            <!-- <div class="order-domain" v-if="orderDomain">
                                via
                                <a
                                    title="Open in new tab"
                                    :href="`${orderDomain}`"
                                    target="_blank">
                                    {{ orderDomain }}
                                </a>
                            </div> -->
                        </div>
                    </div>
                </accordion>
            </div>

            <!-- Key to be decided by the back-end team -->
            <div class="customer-note info-container" v-if="orderData.order.meta.customer_note">
                <accordion :title="'Customer Note'" :initialState="true">
                    <div class="content">
                        <!-- <nitrozen-input
                            :type="'textarea'"
                            v-model="checkForNote"
                            :disabled="true"
                        ></nitrozen-input> -->
                        <textarea name="note" id="note" class="customer-note-input" v-model="checkForNote" readonly></textarea>
                    </div>
                </accordion>
            </div>

            <!-- need currency symbol in payment value -->
            <div class="payment-method info-container">
                <accordion :title="'Payment Method'" :initialState="true">
                    <div class="info-title" v-if="isPrepaid">Prepaid:</div>
                    <div class="content">
                        <span
                            v-for="(value, key) in orderData.order.payment_methods"
                            :key="key"
                            class="content-item"
                        >
                            <span class="title-background">{{ value.name }}</span> :
                            ₹{{ value.amount.toFixed(2) }}</span
                        >
                    </div>
                </accordion>
            </div>

            <div
                class="store-info info-container"
                v-for="(individualDetail, index) in detailsMapping"
                :key="index"
            >
                <accordion
                    v-if="anyDataHasValue(individualDetail.data)"
                    :title="individualDetail.header"
                    :initialState="false"
                >
                    <div class="content">
                        <order-store-info
                            :store_info="individualDetail.data"
                        ></order-store-info>
                    </div>
                </accordion>
            </div>
            <div class="payment-method info-container" v-if="hasFsEmpDetails">
                <accordion :title="'Employee Details'" :initialState="false">
                    <div class="emp-details-list">
                        <p v-for="(value, key) in detailsData.fsEmployee_details" 
                            :key="key" 
                            >
                            <span><span class="title-background">{{ key }}</span> {{ value }}</span>
                            
                        </p>
                       
                    </div>
                </accordion>
            </div>

            <!-- <div
                class="device-info info-container"
                v-if="detailsData.user_agent && detailsData.user_agent"
            >
                <accordion :title="'Device Information'" :initialState="false">
                    <div class="content">
                        <user-device-info
                            :user_agent="detailsData.user_agent"
                        ></user-device-info>
                    </div>
                </accordion>
            </div> -->
        </div>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { NitrozenInput, NitrozenBadge } from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';

/* Component imports */
import InlineSvg from '@/components/common/inline-svg.vue';
import Accordion from '@/components/common/accordion.vue';
import UserDeviceInfo from './user-device-info.vue'; /** Yet */
import OrderingStoreInfo from './order-store-info.vue'; /** Yet */
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';

/* Helper imports */
import { copyToClipboard, convertToOMSDate } from '@/helper/utils.js';
// import {
//     GET_COMPANY_APPLICATIONS,
// } from '@/store/getters.type';
import { getPrimaryDomain } from '@/helper/domains.util';

/* Fixtures/mock imports */
import { DETAILS_INFO_MAPPING } from '@/pages/oms/fixtures/details-info-mapping.js';

/* Service imports */
import AuthService from '@/services/auth.service';

export default {
    name: 'info-section',
    props: {
        orderData: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            customerNote: '',
            detailsData: {},
            maskingLength: 4,
            infoGlobalData: [],
            dataMapped: false,
            detailsMapping: cloneDeep(DETAILS_INFO_MAPPING),
            hasFsEmpDetails: false
        };
    },
    components: {
        NitrozenBadge,
        UktInlineSvg,
        Accordion,
        'inline-svg': InlineSvg,
        NitrozenInput,
        'order-store-info': OrderingStoreInfo,
        UserDeviceInfo,
    },
    mounted() {
        if (isEmpty(this.detailsData) && !isEmpty(this.orderData)) {
            this.detailsData = cloneDeep(this.orderData.shipments)[0];
        }
        if(
            this.detailsData &&
            this.detailsData.order &&
            this.detailsData.order.meta &&
            this.detailsData.order.meta.staff &&
            !isEmpty(this.detailsData.order.meta.staff)
        ) {
            this.getFyndStroeEmployeeDetails(this.detailsData.order.meta.staff);
        }
        this.orderDetailsData();
    },
    computed: {
        created_at() {
            // @NOTE: Converting GMT to Current Timezone Date value
            return convertToOMSDate(this.detailsData.order.order_date);
        },
        checkForNote() {
            this.customerNote = this.orderData.order.meta.customer_note;
            return this.customerNote;
        },
        hasData() {
            return !isEmpty(this.detailsData);
        },
        ...mapGetters({
            // companyApplications: GET_COMPANY_APPLICATIONS,
            companyApplications: {},
        }),
        orderApplication() {
            if(this.orderData && this.orderData.order && this.orderData.order.affiliate_id) {
                return find(this.companyApplications, {
                    id: this.orderData.order.affiliate_id,
                });
            }
            return;
        },
        orderDomain() {
            if (this.orderApplication) {
                return `https://${getPrimaryDomain(
                    this.orderApplication.domains
                )}`;
            }
        },
        isInternational() {
            if(this.detailsData && this.detailsData.delivery_details && this.detailsData.delivery_details.country){
                return !(['in', 'india'].includes(this.detailsData.delivery_details.country.toLowerCase()))
            }
            return false
        },
        isPrepaid(){
            if(this.orderData && this.orderData.order && this.orderData.order.payment_methods){
                return !(Object.keys(this.orderData.order.payment_methods).includes('COD'))
            }
            return false
        }

    },
    methods: {
        isEmpty,
        getFyndStroeEmployeeDetails(staff){
            AuthService.getUserDetails({query:staff._id}).then((data)=> {
                let email, phone_number;
                if(data && data.data && data.data.users && data.data.users[0]) {
                    if(data.data.users[0].emails) {
                        let primaryValue = data.data.users[0].emails.find(item => item.primary);
                        if(primaryValue) {
                            email = data.data.users[0].emails.find(item => item.primary).email || '';
                        } else {
                            return '';
                        }
                    }
                    let fullname = this.fullName(data.data.users[0]);
                    if(data.data.users[0].phone_numbers) {
                        let primaryValue = data.data.users[0].phone_numbers.find(item => item.primary);
                        if(primaryValue) {
                            phone_number = data.data.users[0].phone_numbers.find(item => item.primary).phone || '';
                        } else return '';
                    }
                    this.detailsData['fsEmployee_details'] ={}
                    this.detailsData['fsEmployee_details']['Name:'] = fullname;
                    this.detailsData['fsEmployee_details']['Phone:'] = phone_number;
                    this.detailsData['fsEmployee_details']['Email:'] = email
                    this.hasFsEmpDetails = true
                }
            } ) 
        },
        fullName(data){
            let {first_name, last_name} = data;
            return `${first_name} ${last_name}`
        },
        orderDetailsData() {
            for (let comp of this.detailsMapping) {
                for (let row of comp.data) {
                    row.value =
                        typeof row.key === 'string'
                            ? this.getObjectValue(row.key)
                            : row.key
                                  .map((vs) => this.getObjectValue(vs))
                                  .join(' ');
                }
            }
            this.detailsMapping = this.detailsMapping;
        },
        collapseView() {
            this.$emit('collapseView', true);
        },
        objValueExtractor(obj, source) {
            try {
                return source && source.length
                    ? this.objValueExtractor(obj[source[0]], source.slice(1))
                    : obj;
            } catch (err) {
                return null;
            }

            // Extracts Value from Object recursively
        },
        getObjectValue(source) {
            // Pulls value from Object
            source = source.split('.');
            let obj = this.detailsData; // main object

            return this.objValueExtractor(obj, source);
        },
        copyOrderId(text) {
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard');
        },
        maskNumber(number) {
            let slicedNumber = number.slice(
                0,
                number.length - this.maskingLength
            );
            return slicedNumber.padEnd(number.length, '*');
        },
        anyDataHasValue(data) {
            return data.some((row) => !isEmpty(row.value));
        },
    },
};
</script>

<style lang="less" scoped>
.collapse-icon {
    position: relative;
    right: 0px;
    top: 20px;
    z-index: 1;
    display: flex;
    justify-content: flex-end;
}
.collapsable-arrow {
    cursor: pointer;
    width: 24px;
    height: 24px;
}

.info-section-container {
    height: 100%;
    position: relative;
    font-size: 14px;

    .info-container {
        margin-bottom: 2rem;

        .content {
            padding: 8px 0;
            font-weight: 300;
            line-height: 22px;
            // ::v-deep .nitrozen-form-input {
            //     .nitrozen-input-grp {
            //         .n-input:disabled {
            //             background: #ffffff;
            //             color: #4d4d4e;
            //         }
            //     }
            // }
            .title-background {
                color: #9b9b9b;
            }
            .content-item {
                margin-right: 10px;
            }
        }

        ::v-deep .filter-arrow-up,
        ::v-deep .filter-arrow-down {
            right: 0 !important;
        }
    }

    .channel-info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;

        .channel-details {
            .title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .content {
                display: flex;
                align-items: center;

                .img-container {
                    margin-right: 8px;
                    img {
                        height: 46px;
                        max-height: 42px;
                        object-fit: contain;
                    }
                }

                .channel-name {
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: capitalize;
                }
            }
        }
    }

    .order-info {
        .content {
            .order-id-container {
                display: flex;
                align-items: center;
                cursor: pointer;
                // margin-bottom: 8px;

                .order-id {
                    color: @RoyalBlue;
                    padding-bottom: 8px;
                    font-weight: 500;
                }
            }
        }
    }

    // .shipping-details .content > div,
    // .billing-details .content > div {
    //     margin-bottom: 8px;
    // }

    .payment-method {
        .info-title{
            padding-top: 10px;
        }
        
        .content {
            display: flex;
            align-items: center;
        }

        .payment-icon {
            height: 35px;
            width: 35px;
        }
    }
}

.copy-icon {
    display: inline !important;
    ::v-deep svg {
        cursor: pointer;
        width: 12px;
        height: 12px;
        margin-left: 12px;
    }
}
.hide {
    display: none;
}
.sub-link {
    margin-bottom: 8px;

    a:hover {
        color: @RoyalBlue;
        text-decoration: underline;
    }
}
.emp-details-list{
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    font-weight: 300;
    line-height: 22px;
    padding: 8px 0;
    .title-background {
        color: #9b9b9b;
    }
}

.customer-note {
    .content {
        .customer-note-input {
            height: 96px;
            line-height: 21px;
            padding: 6px 12px 0px 12px;
            color: #4D4D4E;
            border: 1px solid #E0E0E0;
            border-radius: 3px;
            width: 100%;
            background: #ffffff;
            font-family: Inter,sans-serif;
            position: relative;
            outline: none;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            font-size: 14px;
            -webkit-appearance: none;
            cursor: default;
            resize: vertical;
        }
    }
}
</style>
