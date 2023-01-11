<template>
    <div class="top-box" v-if="manifestList && manifestList.length">
        <table class="mirage-table list-table">
            <!-- Headers -->
            <tr class="table-header-row">
                <th>Delivery Partner</th>
                <th>Manifest ID</th>
                <th>Fulfilment Location</th>
                <th>Channels</th>
                <th>Shipments</th>
                <th v-if="tabIndex == 0">Action</th>
                <th v-if="tabIndex == 1">&nbsp;&nbsp;</th>
            </tr>

            <!-- Individual row -->
            <tr
                class="line-break"
                v-for="(manifestData, index) in manifestList"
                :key="'shipment-' + manifestData.manifest_id"
                @click="navigate(manifestData)"
            >
                <!-- Table cell: Delivery Partner (DP), DP image, and Delivery Slot  -->
                <td>
                    <div class="dp-image-name">
                        <div class="application-logo">
                            <span
                                class="image-logo"
                                v-if="manifestData.meta.filters && manifestData.meta.filters.logo ">
                                <img
                                    :title="manifestData.meta.filters.dp_name"
                                    :alt="manifestData.meta.filters.dp_name"
                                    :src="
                                        manifestData.meta.filters.logo
                                    "
                                />
                            </span>
                        </div>

                        <div
                            class="shipment-id-main"
                            v-if="showDPName(manifestData)"
                        >
                            <span class="shipment-id common-struct" title="Click to copy">
                                {{ manifestData.meta.filters.dp_name }}
                            </span>
                            <div
                                class="placed-on common-struct"
                                v-if="showDeliverySlot(manifestData)">
                                {{ deliveryDateInOMSFormat(manifestData) }}
                            </div>
                        </div>
                    </div>
                </td>

                <!-- Table cell: Manifest ID and Manifest Creation Time -->
                <td>
                    <div>
                        <div class="shipment-stats common-struct">
                            <span>{{ manifestData.manifest_id }} </span>
                            <span v-if="manifestData.pdf_meta && manifestData.pdf_meta.consent"
                                ><ukt-inline-svg src="attachment"
                            /></span>
                        </div>
                        <div
                            class="payment-method common-struct"
                            v-if="showManifestCreatedAtDate(manifestData)">
                            <span>{{ convertToOMSDate(manifestData.created_at) }}</span>
                        </div>
                    </div>
                </td>

                <!-- Table cell: Fulfillment Centre -->
                <td class="application-holder">
                    <div>
                        <span
                            class="application-name common-struct"
                            v-if="showFulfillmentCentre(manifestData)">
                            {{ manifestData.meta.filters.store_name }}
                        </span>
                    </div>
                </td>

                <!-- Table cell: Sales Channel -->
                <td>
                    <div id="channel-name">
                        <span
                            class="channel-name common-struct"
                            v-if="showChannel(manifestData)">
                            {{ manifestData.meta.filters.sales_channels_name}}
                        </span>
                    </div>
                </td>

                <!-- Table cell: Shipments Count -->
                <td>
                    <div id="shipments-count">
                        <span
                            class="common-struct"
                            v-if="showShipmentsCount(manifestData)">
                            {{ manifestData.meta.total_shipment_prices_count.shipment_count }}
                        </span>
                    </div>
                </td>

                <!-- Table cell: Action Button -->
                <td>
                    <div class="button-demo" @click.stop >
                        <!-- <nitrozen-button
                            :disabled="false"
                            v-if="tabIndex == 0"
                            v-strokeBtn
                            theme="secondary"
                            @click.stop="
                                processManifest(manifestData.manifest_id)
                            "
                        >
                            Process
                        </nitrozen-button> -->

                        <div tabindex="0" @blur="() => handleMenu(index)" >
                            <nitrozen-menu
                            v-if="tabIndex == 1"
                            class="actions-menu"
                            mode="vertical"
                            ref="actionsMenu"
                        >
                            <nitrozen-menu-item
                                 v-if="manifestData.pdf_meta && manifestData.pdf_meta.consent"
                                class="menu-item"
                                @click="downloadConsent(manifestData)"
                                >Download Consent
                            </nitrozen-menu-item>
                            <nitrozen-menu-item
                                v-else
                                class="menu-item"
                                @click.stop="processManifest(manifestData.manifest_id)"
                                >Upload Consent
                            </nitrozen-menu-item>
                        </nitrozen-menu>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

/* Component imports */
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AdmInlineSvg from '@/components/common/inline-svg';

/* Helper imports */
import {
    copyToClipboard, convertSnakeCaseToString, convertToOMSDate
} from '@/helper/utils.js';
import {
    displaySlaPercentage, displaySlaHoursLeft, displaySlaTooltip
} from '@/pages/oms/sla/helper.js';

import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    clickOutside,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenBadge,
    NitrozenTooltip,
} from '@gofynd/nitrozen-vue';

export default {
    name: 'manifest-item',
    components: {
        NitrozenButton,
        UktInlineSvg,
        AdmInlineSvg,
        NitrozenTooltip,
        'nitrozen-menu': NitrozenMenu,
        'nitrozen-menu-item': NitrozenMenuItem,
        NitrozenBadge,
    },
    directives: { flatBtn, strokeBtn, clickOutside },
    props: {
        manifestList: {
            type: Array,
            required: true,
        },
        tabIndex: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            bagDialogView: false,
            shipmentId: '',
            orderNumId: '',
            selectedShipmentData: [],
            shipmentStatus: '',
            advancedFilterView: false,
        };
    },

    methods: {
        convertSnakeCaseToString,
        displaySlaPercentage,
        displaySlaHoursLeft,
        displaySlaTooltip,
        convertToOMSDate,

        close: function (e) {
            e.stopPropagation();
            this.bagDialogView = false;
        },
        handleMenu(i){
            this.$refs.actionsMenu[i].closeMenu()
        },

        /**
         * This method slightly differs from the helper method because
         * we will be receiving the date always in DD-MM-YYYY format as
         * confirmed by Neha from the back-end team.
         *
         * @changeLog now neha will share the IST date string
         *
         * @author: Rushabh Mulraj Shah
         * @param {String} date The date string
         */
        convertToSpecificOMSDate(date) {
            return moment(date).format('D MMM YYYY, LT');
        },

        copyToClipboard(e, text) {
            e.stopPropagation();
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        },

        /**
         * Method to convert delivery slot in the required format.
         * It handles the scenario where if the from and the to date have
         * the same day or they belong to different dates.
         *
         * @author: Rushabh Mulraj Shah
         * @param {object} manifestData The individual entry from a group of data.
         */
         deliveryDateInOMSFormat(manifestData) {
            let fromDate = manifestData.meta.filters.pickup_slot_start_time;
            fromDate = moment(fromDate, 'DD-MM-YYYY');
            let toDate = manifestData.meta.filters.pickup_slot_end_time;
            toDate = moment(toDate, 'DD-MM-YYYY');
            let sameDay = moment(fromDate).isSame(toDate);

            if(sameDay) {
                let day = moment(fromDate).format('DD MMM, YYYY');
                let timeSlot = `${moment(fromDate).format('LT')} - ${moment(toDate).format('LT')}`;
                return `${day} ${timeSlot}`;
            } else {
                return `${moment(fromDate).format('DD MMM YYYY, LT')} - ${moment(toDate).format('DD MMM YYYY, LT')}`
            }
        },

        /**
         * Method to download the consent
         *
         * @author: Rushabh Mulraj Shah
         * @param {Object} manifestData The manifest data for the particular row
         */
        downloadConsent(manifestData) {
            let consentLink = manifestData.pdf_meta && manifestData.pdf_meta.consent;
            if(consentLink) {
                this.$emit('downloadingDoc', true);

                fetch(
                    consentLink
                )
                    .then((res) => res.blob())
                    .then((blob) => {
                        let link = document.createElement('a');
                        let url = window.URL.createObjectURL(blob);
                        link.href = url;
                        link.download = `Consent-${manifestData.manifest_id}.pdf`
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }).catch((err)=> {
                        this.$snackbar.global.showError('Failed to download consent')
                        console.log('Failed to download consent', err)
                    });


                // const link = document.createElement('a');
                //     link.href = consentLink;
                //     link.download = `Consent-${manifestData.manifest_id}`;
                //     link.target = '_blank';
                //     document.body.appendChild(link);
                //     link.click()

                // setTimeout(() => {

                // }, 2000);

                this.$emit('downloadingDoc', false);

                // setTimeout(() => {

                // }, 2500);
            } else {
                console.error("Unable to download the file");
                this.$snackbar.global.showError(
                    'We are unable to download the consent right now. Kindly try again after some time.',
                    3000
                );
            }
        },

        downloadManifest() {
            this.$emit('downloadingDoc', false);
        },

        processManifest(manifest_id) {
            /*@author Sameer shaikh
             *  This will emit to the parent about this calls
             */
            this.$emit('openConsentEvent', manifest_id);
        },

        /**
         * Method to navigate the application to the manifest details page
         *
         * @author: Rushabh Mulraj Shah
         * @param {Object} manifestData The data pertaining to the manifest selected
         */
        navigate(manifestData) {
            let cleansedQuery = Object.keys(cloneDeep(this.$route.query))
                .filter((key) => {
                    let item = this.$route.query[key];
                    return (
                        item !== undefined && item !== null && item.length > 0
                    );
                })
                .reduce((finalObj, key) => {
                    let value = this.$route.query[key];
                    finalObj[key] = value;
                    return finalObj;
                }, {});

            if(manifestData.filters && manifestData.filters.lane) {
                cleansedQuery['lane'] = manifestData.filters.lane;
            }

            if(manifestData.filters && manifestData.filters.dp_ids) {
                cleansedQuery['dp_ids'] = manifestData.filters.dp_ids;
            }

            if(manifestData.filters && !isEmpty(manifestData.filters.date_range)) {
                if(manifestData.filters.date_range.from_date) {
                    cleansedQuery['from_date'] = manifestData.filters.date_range.from_date;
                } if(manifestData.filters.date_range.to_date) {
                    cleansedQuery['to_date'] = manifestData.filters.date_range.to_date;
                }
            }

            this.$router.push({
                name: 'company-manifest-detail',
                params: {
                    manifestId: manifestData.manifest_id,
                },
                query: {
                    ...cleansedQuery
                },
            });
        },

        /**
         * Group of methods to decide whether a particular table cell needs
         * to be shown.
         *
         * @author: Rushabh Mulraj Shah
         * @param {object} manifestData The individual entry from a group of data
         */
        showChannel(manifestData) {
            return manifestData.meta &&
            manifestData.meta.filters &&
            manifestData.filters.sales_channels_name;
        },
        showDeliverySlot(manifestData) {
            return manifestData.meta &&
            manifestData.meta.filters &&
            manifestData.meta.filters.pickup_slot_end_time &&
            manifestData.meta.filters.pickup_slot_start_time
        },
        showDPName(manifestData) {
            return manifestData.meta &&
            manifestData.meta.filters &&
            manifestData.meta.filters.dp_name;
        },
        showFulfillmentCentre(manifestData) {
            return manifestData.meta &&
            manifestData.meta.filters &&
            manifestData.filters.store_name;
        },
        showManifestCreatedAtDate(manifestData) {
            return manifestData &&
            manifestData.created_at;
        },
        showShipmentsCount(manifestData) {
            return manifestData.meta &&
            manifestData.meta.total_shipment_prices_count &&
            manifestData.meta.total_shipment_prices_count.shipment_count;
        }
    },
};
</script>

<style lang="less" scoped>
// @import '../../less/form.less';
@import '../../../less/common.less';

.menu-item {
    vertical-align: top;
    text-align: left;
    padding: 16px 6px;
    font-size: 12px;
    line-height: 17px;
}

.list-table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 0px;
    // font-family: Inter, sans-serif;
    font-size: 14px;
    // ::v-deep .eye-icon > svg {
    //     width: 16px;
    //     height: 16px;
    //     #prefix__Eye_Open {
    //         stroke: @Mako;
    //     }
    //     &:hover {
    //         box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
    //         #prefix__Eye_Open {
    //             stroke: @RoyalBlue;
    //         }
    //     }
    // }
    tr:hover {
        cursor: pointer;
        background-color: #f5f8ff;
    }
    .table-header-row {
        position: sticky;
        top: 0;
        z-index: 1;
        box-sizing: border-box;
        width: 1094px;
        height: 47.37px;
        background: #f6f6f6;
        /* colour/border */

        // border: 1px solid #E0E0E0;
        border-bottom: 1px solid #eeeeee;
        border-radius: 4px;
        // background: @Alabaster2;
        // color: @Black;

        // font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        /* identical to box height, or 142% */

        /* Text/primary */

        color: @Mako;
    }
    tr:not(:first-child) {
        border-bottom: none;
        width: 1092px;
        height: 64px;
    }
    tr:last-child {
        border-bottom: none;
    }
    th:first-child {
        // width: 110px;
        padding-left: 24px;
    }
    th {
        position: sticky;
        top: 0;
        vertical-align: middle;
        text-align: left;
        // width: 52.43px;
        height: 17px;
        // font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        /* identical to box height, or 142% */

        /* Text/primary */

        color: #41434c;
    }
    th:not(:first-child) {
        padding-left: 5px;
    }
    td {
        vertical-align: top;
        text-align: left;
        padding: 12px 6px;
    }
    tr.line-break td {
        position: relative;
        // top: 1px;
    }
    tr.line-break td:after {
        content: '';
        position: absolute;
        top: -1px;
        left: 0px;
        height: 1px;
        // width: 90%;
        width: 100%;
        background-color: rgb(235, 235, 235);
    }
    tr.line-break td:first-child:after,
    tr.line-break td:last-child:after {
        width: calc(100% - 24px);
    }
    tr.line-break td:first-child:after {
        right: 0px;
        left: auto;
    }
}
.application-holder {
    display: flex;
    width: 100%;
}
.common-struct {
    font-weight: 300;
    font-size: 14px;
    line-height: 17px;
    ::v-deep .inline-svg {
        display: inline;
        padding-left: 2px;
    }
}
.dp-image-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 16px;

    .application-logo {
        padding-right: 10px;
        text-align: center;
    }
    img {
        object-fit: contain;
        width: 32px;
        height: 32px;
    }
    .image-logo {
        padding-top: 5px;
    }

    .shipment-id-main {
        .shipment-id {
            box-shadow: inset 0 0 0 0 @RoyalBlue;
            margin: 0 -0.25rem;
            padding: 0.5px 0.25rem;
            // transition: color .1s ease-in-out, box-shadow .2s ease-in-out;
            font-weight: 300;

            // &:hover {
            //     transition-delay: 0.15s;
            //     box-shadow: inset 180px 0 0 0 @RoyalBlue;
            //     color: white;
            // }
        }
    }
}

.application-name {
    width: 100%;
    // padding: 4px 0px 0px 16px;
}
.order-id {
    width: 149px;
    color: @Mako;
}
.placed-on {
    // width: 153.39px;
    color: @DustyGray2;
    margin-top: 6px;
}
.payment-method {
    // width: 153.39px;
    color: @DustyGray2;
    margin-top: 6px;
}
.store-info {
    width: 25px;
}
.number-shipments {
    width: 40px;
    color: @RoyalBlue;
}
.items {
    width: 40px;
    color: @Mako;
}
.top-box {
    // overflow-y: auto;
    // height: 110px;
    box-sizing: border-box;
    // height: 400px;
    border-bottom: none;
    border-top: none;
    background: @White;
    /* colour/border */

    border: 1px solid #e0e0e0;
    border-radius: 4px;
}
// .order-ids {
//     left: 166px;
// }
// .nitrozen-badge {
//     padding: 4px 8px;
//     @media @mobile{
//         margin: 0 0 8px 0;
//     }
// }
.nitrozen-badge {
    height: 16px;
    padding: 4px 8px;
    display: inline-block;
    cursor: default;
    border-radius: 2px;
    border: 1px solid #9b9b9b;
    color: @White;
    font-size: 12px;
    white-space: nowrap;
    // font-family: Inter,sans-serif;
    line-height: 18px;
    text-transform: uppercase;
}

// @TODO Remove CSS above this line if not used
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
        width: 30%;
        height: 100%;
        background: @White;
        overflow-y: scroll;
        overflow-x: hidden;
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
            margin: 13px 10px 0px 0px;
            cursor: pointer;
        }
    }
}

.drawer-view {
    height: 100%;
    position: fixed;
    // top: 64px; // To expose header
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;

    .drawer-container {
        background-color: #ffffff;
        position: absolute;
        right: 0px;
        width: calc(100% - 600px);
        height: 100%;
        overflow-y: scroll;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
        &::-webkit-scrollbar {
            display: none !important;
        }
        @media @mobile {
            position: fixed;
            width: 100%;
        }
    }

    .cancel-btn {
        position: absolute;
        top: 24px;
        right: 20px;
        cursor: pointer;
    }
}
.bags-item-images {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 8px;
    margin-right: 30px;
    .item-images {
        position: relative;
        img {
            width: 35px;
            height: 35px;
            // left: 1113px;
            // top: 583px;
            border-radius: 4px;
            object-fit: cover;
        }
    }
    .item-count-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .count-text {
            font-size: 15px;
            color: #fff;
        }
    }
}

.sla-block {
    min-width: 40px;
}
.sla-status {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-right: 20px;
    .sla-time {
        margin-top: 5px;
        font-weight: 400;
        font-size: 12px;
        white-space: nowrap;
        color: #4d4d4e;
    }
}

.application-name,
.channel-name {
    text-transform: capitalize;
}
</style>
