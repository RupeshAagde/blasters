<template>
    <div class="order-item">
        <div class="order-header" @click="naivgateToOrder($event)">
            <div class="order-info-container" v-if="data.user">
                <div class="full-name card-content-line-1">
                    {{
                        data.user.uid
                            ? data.user.first_name + ' ' + data.user.last_name
                            : 'Anonymous User'
                    }}
                </div>
                <div class="card-content-line-2" v-if="data.user.uid">
                    <span
                        title="Click to copy"
                        @click="copyToClipboard($event, data.user.mobile)"
                    >
                        {{ data.user.mobile }}
                    </span>
                    <!-- <adm-inline-svg
                        class="verified-icon left-space-s"
                        :src="'check-circle'"
                        title="Verified"
                    ></adm-inline-svg> -->
                    <span class="left-space-md">|</span>
                    <span
                        class="left-space-md"
                        title="Click to copy"
                        @click="copyToClipboard($event, data.user.email)"
                    >
                        {{ data.user.email }}
                    </span>
                    <!-- <adm-inline-svg
                        class="verified-icon left-space-s"
                        :src="'check-circle'"
                        title="Verified"
                    ></adm-inline-svg> -->
                </div>
                <div class="card-content-line-2">
                    <span
                        title="Click to copy"
                        class="order-id"
                        @click="copyToClipboard($event, data.id)"
                    >
                        {{ data.id }}
                    </span>
                    <span class="left-space-md">|</span>
                    <span class="left-space-md">
                        {{ created_at }}
                    </span>
                </div>
            </div>
            <div class="platform-logo">
                <div class="application-info">
                    <img
                        :title="application.name"
                        :alt="application.name"
                        :src="application.logo"
                    />
                    <div class="application-name">{{ application.name }}</div>
                </div>
            </div>
        </div>
        <div class="shipment-div">
            <div
                class="shipment-data"
                v-for="(item, index) in data.shipments"
                :key="`${item.id}_${index}`"
                @click="quickShipmentViewSection(item.id)"
            >
                <div class="priority-info">
                    <nitrozen-badge
                        class="ma-left"
                        v-if="item.priority < 10"
                        :style="{
                            color: '#F4F4F4',
                            'background-color':'#2E31BE',
                            'font-weight' : 600,
                            'border-color': '#2E31BE',
                            'padding': '1px 8px'
                        }"
                    >
                        {{item.priority_text || 'High Priority'}}
                    </nitrozen-badge>
                    <div class="shipment-lock" v-if="item.lock_status && item.ordering_channel == 'MARKETPLACE'">
                        <adm-inline-svg src="lock" title="Shipment is locked"></adm-inline-svg>
                    </div>
                </div>
                <div class="shipment-info">
                    <div class="shipment-image" v-if="item.bags[0]">
                        <img
                            :src="item.bags[0].item.image[0]"
                            :alt="item.bags[0].item.name"
                            @error="getErrorImage(item, index)"
                        />
                    </div>
                    <div v-else class="bold-md">
                        Weird, no bags in shipment!
                    </div>
                    <div class="shipment-details">
                        <template v-if="item.bags[0]">
                            <div class="shipment-line-1">
                                <div class="shipment-stats">
                                    <span class="product-name">
                                        {{ item.bags[0].item.name }}
                                    </span>
                                </div>
                            </div>
                            <div class="shipment-line-1">
                                <div class="shipment-stats">
                                    <span>{{ item.bags[0].item.brand }}</span>
                                </div>
                            </div>
                            <div class="shipment-line-1">
                                <div class="shipment-stats">
                                    <span
                                        >{{ item.total_shipment_bags }} Piece{{
                                            item.total_shipment_bags > 1
                                                ? 's'
                                                : ''
                                        }}</span
                                    >
                                </div>
                            </div>
                        </template>
                        <div class="shipment-line-1">
                            <div class="shipment-stats">
                                <span
                                    >{{
                                        item.gst.brand_calculated_amount
                                            | currencyformat
                                    }}
                                    <nitrozen-tooltip>
                                        <div class="order-custom-tooltip">
                                            <price-detail
                                                :shipment="item"
                                            ></price-detail>
                                        </div>
                                    </nitrozen-tooltip>
                                </span>
                                <nitrozen-badge
                                    class="right-align bage-bottom"
                                    :style="{
                                        color:
                                            item.status.color_code || 'green',
                                        'border-color':
                                            item.status.color_code || 'green',
                                    }"
                                >
                                    {{ item.status.name }}
                                </nitrozen-badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="data.total_shipments_in_order > 3"
                class="shipment-data see-all-shipment-card"
                title="See all shipments"
                @click="naivgateToOrder($event)"
            >
                <div class="message">
                    See {{ data.total_shipments_in_order - 3 }} more shipments
                </div>
                <ukt-inline-svg src="arrow-right-black"></ukt-inline-svg>
            </div>
        </div>

        <transition name="slide">
            <template v-if="quickShipmentView">
                <div class="slide-fade" ref="slide-fade" @click="close($event)">
                    <div class="container">
                        <shipment-detail-drawer
                            ref="shipmentDrawer"
                            :order_id="data.id"
                            :shipment_id="shipmentId"
                            :readOnlyMode="readOnlyMode"
                        ></shipment-detail-drawer>
                        <a class="cancel-btn" @click="close($event)">
                            <ukt-inline-svg
                                :src="'cross-black'"
                            ></ukt-inline-svg>
                        </a>
                    </div>
                </div>
            </template>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AdmInlineSvg from '@/components/common/adm-inline-svg';
import { copyToClipboard } from '@/helper/utils.js';
import { NitrozenBadge, NitrozenTooltip } from '@gofynd/nitrozen-vue';
import PriceDetail from './prices-detail.vue';
import moment from 'moment';
import find from 'lodash/find';
import shipmentDrawer from './shipment-detail-drawer.vue';

// import { GET_COMPANY_APPLICATIONS } from '@/store/getters.type';
// import { ADMIN_GET_REGISTERED_MARKETPLACES } from '@/store/getters.type';
export default {
    name: 'order-item',
    components: {
        NitrozenBadge,
        UktInlineSvg,
        AdmInlineSvg,
        NitrozenTooltip,
        PriceDetail,
        'shipment-detail-drawer': shipmentDrawer,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        readOnlyMode: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            quickShipmentView: false,
            shipmentId: "",
        }
    },
    computed: {
        ...mapGetters({
            // companyApplications: GET_COMPANY_APPLICATIONS,
            // registeredMarketplaces: ADMIN_GET_REGISTERED_MARKETPLACES,
        }),
        application() {
            let result = {};
            // result = find(this.companyApplications, {
            //     id: this.data.application.id,
            // });
            // if (!result) {
            //     let temp_result = null;
            //     for (let mkp in this.registeredMarketplaces) {
            //         if (
            //             this.registeredMarketplaces[mkp].app_id ==
            //             this.data.application.id
            //         ) {
            //             temp_result = this.registeredMarketplaces[mkp];
            //             temp_result.name = mkp;
            //             temp_result.id = this.data.application.id;
            //         }
            //     }
            //     result = temp_result ? temp_result : this.data.application;
            //     result.logo = this.data.channel && this.data.channel.logo;
            //     // if(!result.name)
            //     //     result.name = this.data.channel && this.data.channel.name;
            // }
            return result;
        },
        created_at() {
            // @NOTE: Converting GMT to Current Timezone Date value
            return moment(this.data.created_at)
                .add(new Date().getTimezoneOffset(), 'minutes')
                .format('LT, MMM Do, YY');
        },
        // firstFewShipments() {
        //     const count = this.data.shipments.length;
        //     if (count <= 6) {
        //         return { shipments: this.data.shipments, count };
        //     }
        //     return { shipments: this.data.shipments.slice(0, 5), count };
        // },
    },
    mounted() {},
    created() {
        document.addEventListener('keydown', this.detectKeyboardEvent);
    },
    beforeDestroy: function () {
        document.removeEventListener('keydown', this.detectKeyboardEvent);
    },

    methods: {
        naivgateToOrder(event, shipment_id = '') {
            event.preventDefault();
            event.stopPropagation();
            let path = this.getShipmentLink(shipment_id);
            this.$router.push({ path, query: { ...this.$route.query } });
        },
        getShipmentLink(shipment_id = '') {
            let link = `${this.$basePath}/order/${this.data.id}/shipments`;
            if (shipment_id) {
                link = `${link}?shipment_id=${shipment_id}`;
            }
            return link;
        },
        getErrorImage(item, index) {
            let image =
                '/public/admin/assets/admin/pngs/product_image_placeholder.png';
            this.$set(item.bags[0].item.image, 0, image);
        },
        copyToClipboard(e, text) {
            e.stopPropagation();
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        },
        quickShipmentViewSection: function (shipment_id) {
            this.quickShipmentView = !this.quickShipmentView;
            this.shipmentId = shipment_id;
        },
        close: function (e) {
            e.stopPropagation();
            this.quickShipmentView = false;
        },
        detectKeyboardEvent(event) {
            if (event.keyCode == 27) {
                this.close(event);
            }
        },
    },
};
</script>

<style lang="less" scoped>
.order-item {
    color: @Mako;
    border-radius: 4px;
    margin: 24px 0px;
    padding: 16px;
    // .order-id {
    //     display: flex;
    //     cursor: pointer;
    //     width: 50%;
    // }
    .order-header {
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: space-between;
        .platform-logo {
            display: flex;
            justify-content: flex-end;
            flex: 1;
            .application-info {
                text-align: center;
                img {
                    height: 30px;
                    @media @mobile {
                        height: 20px;
                    }
                }
                .application-name {
                    font-size: 14px;
                    color: @DustyGray2;
                }
            }
        }
        h3 {
            margin: 10px;
        }
        h4 {
            margin: 10px;
        }
        .filter {
            position: absolute;
            right: 20px;
        }
        .filter-arrow-up {
            margin-left: auto;
            transform: rotate(180deg);
        }
        .filter-arrow-down {
            margin-left: auto;
        }
    }
}

.slide-leave-active,
.slide-enter-active {
    transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

.overlay {
    height: 100%;
    position: fixed;
    top: 0px;
    right: 320px;
    width: 100%;
    z-index: @dialog;
    background-color: rgba(82, 78, 78, 0.52);
}

.slide-fade {
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;
    .container {
        position: absolute;
        right: 0px;
        width: 70%;
        height: 100%;
        background: @White;
        overflow-y: scroll;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
        &::-webkit-scrollbar {
            display: none;
        }
        @media @mobile {
            position: fixed;
            width: 100%;
        }
        .cancel-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            cursor: pointer;
        }
    }
}
.shipment-div {
    display: flex;
    flex-wrap: wrap;
    @media @mobile {
        display: block;
    }
    .shipment-data {
        animation: fadeIn 0.5s ease;
        border-top: none;
        flex: 0 calc(50% - 30px);
        cursor: pointer;
        padding: 6px 1%;
        margin: 12px 0 0;
        border-radius: 3px;
        .priority-info{
            display:flex;
            .shipment-lock{
                padding-right: 12px;
                margin-left: auto;
                ::v-deep svg {
                    height: 18px;
                    fill: @RoyalBlue;
                    transition:all 0.6s ease;
                }
            }
        }
        
        &:nth-child(even) {
            border-left: 1px dotted @GrayShade;
            @media @mobile {
                border-left: none;
            }
        }
        &:hover {
            transition: all 0.3s;
            background-color: @WhiteSmoke;
        }
        .shipment-left {
            display: table-cell;
            width: 125px;
            img {
                max-width: 110px;
                max-height: 180px;
            }
        }
        .shipment-right {
            display: table-cell;
            vertical-align: top;
            color: @Mako;
            .shipment-id {
                margin: 10px 0px;
                line-height: 20px;
            }
            .status {
                text-align: center;
                color: @White;
                padding: 10px;
                display: inline-flex;
                border-radius: @BorderRadius;
            }
            .shipment-brands {
                margin: 10px 0px;
                .info {
                    margin-left: 10px;
                }
            }
        }
    }
    .see-all-shipment-card {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 500;
        background-color: @WhiteSmoke;
        flex: 0 40%;
        margin: 36px auto 12px auto;
        &:hover {
            background-color: @WildSand;
        }
    }
}

.copy {
    padding: 12px;
    cursor: pointer;
    ::v-deep svg {
        width: 14px;
        height: 14px;
    }
}

.order-info-container {
    .verified-icon {
        display: inline;
        ::v-deep svg {
            cursor: pointer;
            width: 12px;
            height: 12px;
        }
    }
    .left-space-s {
        margin-left: 4px;
    }
    .card-content-line-1 {
        color: @Mako;
        font-weight: 600;
        font-size: 16px;
        -webkit-font-smoothing: antialiased;
        line-height: 22px;
        @media @mobile {
            font-size: 14px;
        }
    }
    .card-content-line-2 {
        color: @DustyGray2;
        line-height: 22px;
        font-size: 14px;
        display: flex;
        margin-top: 6px;
        @media @mobile {
            font-size: 12px;
        }
        .order-id {
            color: @Mako;
            font-weight: 600;
        }
    }
    .left-space-md {
        margin-left: 6px;
    }
}
.shipment-info {
    display: flex;
    height: 100%;
    margin-top: 4px;
    .shipment-image {
        width: 15%;
        img {
            width: 100%;
            height: auto;
            @media @mobile {
                width: 40px;
            }
        }
    }
    .shipment-details {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-left: 24px;
        width: 85%;
        .shipment-stats {
            color: #9b9b9b;
            line-height: 22px;
            font-size: 14px;
            .product-name {
                color: @Mako;
                font-weight: 600;
            }
            .right-align {
                float: right;
                margin-right: 16px;
                @media @mobile {
                    float: left;
                }
            }
            .bage-bottom{
                margin-bottom: 18px;
                @media @mobile {
                    margin-bottom: 0px
                }
            }
            .order-custom-tooltip{
                text-align: left;
                padding: 6px 0px 6px 6px;
            }
        }

        .shipment-line-1 {
            width: 100%;
        }
    }
}
</style>
