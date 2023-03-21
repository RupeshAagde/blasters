import ApiService from './api.service';
import URLS from './domain.service';
import {
    getCommonHeaderOptions
} from './utils.service';
import moment from 'moment';
import root from 'window-or-global';
if (root && root.process && root.process.env && root.process.env.NODE_ENV == 'test') {
    root.env = {}
    root.env.FYND_PLATFORM_DOMAIN = 'xyz.com'
}
// jugaad
function setUserIdCookie(userinfo) {
    // following cookie logic copied from aldaviz
    root.document.cookie = `user_id=${userinfo.user._id}; expires=Fri, 3 Aug 2022 20:47:11 UTC; path=/;domain=.${root.env.FYND_PLATFORM_DOMAIN}`;
}

// jugaad
function setComputronCookie() {
    //need to fix this
    root.document.cookie = `computron_auth_key=3BtTp6S7JmYZ2yaE9BDZisg424PUnO2W; expires=Fri, 3 Aug 2022 20:47:11 UTC; path=/;domain=.${root.env.FYND_PLATFORM_DOMAIN}`;
}

const OrderService = {
        // Platform orders
        fetchOrders(params) {
            let axiosOption = Object.assign({},
                getCommonHeaderOptions(!!params.app_id), {
                    params: params
                }
            );
            return ApiService.get(URLS.ORDERS_LIST(), axiosOption);
        },
        // fetchOrderLanesCount(comapnyId, params) {
        //     let axiosOption = Object.assign({},
        //         getCommonHeaderOptions(!!params.app_id), {
        //             params: params
        //         }
        //     );
        //     return ApiService.get(URLS.ORDER_LANES_COUNT(), axiosOption);
        // },
        fetchOrderDetails(params) {
            let axiosOption = Object.assign({},
                getCommonHeaderOptions(), {
                    params: params
                }
            );
            return ApiService.get(URLS.ORDER_DETAILS(), axiosOption);
        },
        // fetchPicklistOrder(comapnyId, params) {
        //     let axiosOption = Object.assign({},
        //         getCommonHeaderOptions(!!params.app_id), {
        //             params: params
        //         }
        //     );
        //     return ApiService.get(URLS.ORDERS_PICKLIST(comapnyId), axiosOption);
        // },
        // getShipmentAddress(params) {
        //     const { shipment_id, address_category } = params;
        //     let axiosOption = Object.assign({}, getCommonHeaderOptions());
        //     return ApiService.get(
        //         URLS.ORDER_SHIPMENTS_ADDRESS(shipment_id, address_category),
        //         axiosOption
        //     );
        // },
        // updateShipmentAddress(params, data) {
        //     const { shipment_id, address_category } = params;
        //     let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { data });
        //     return ApiService.post(
        //         URLS.ORDER_SHIPMENTS_ADDRESS(shipment_id, address_category),
        //         axiosOption
        //     );
        // },
        // updateShipmentStatus(data) {
        //     let axiosOption = Object.assign({}, getCommonHeaderOptions(false), {
        //         data
        //     });
        //     return ApiService.post(
        //         URLS.ORDER_SHIPMENTS_STATUS_UPDATE(),
        //         axiosOption
        //     );
        // },
        bagActivityStatus(bag_id) {
            let axiosOption = Object.assign({},
                getCommonHeaderOptions(), {
                    params: {
                        bag_id
                    }
                }
            );
            return ApiService.get(URLS.BAG_ACTIVITY_STATUS(), axiosOption);
        },
        processShipments(data) {
            let axiosOption = Object.assign({},
                getCommonHeaderOptions(), {
                    data
                }
            );
            return ApiService.post(URLS.STORE_PROCESS_SHIPMENTS(), axiosOption);
        },

        canShipmentBreak(data) {
            let axiosOption = Object.assign({},
                getCommonHeaderOptions(), {
                    data
                }
            )
            return ApiService.post(URLS.SHIPMENT_CAN_BREAK_OR_NOT(), axiosOption)
        },

        // bulk operations

        getInvoiceList(userinfo, data) {
            setUserIdCookie(userinfo);
            setComputronCookie();
            let axiosOption = Object.assign({}, getCommonHeaderOptions(), { data });
            return ApiService.post(
                URLS.SHIPMENT_INVOICE('get'),
                axiosOption
            );
        },
        getManifestList(userinfo, data) {
            setUserIdCookie(userinfo);
            setComputronCookie();
            let axiosOption = Object.assign({}, getCommonHeaderOptions(), { data });
            return ApiService.post(
                URLS.SHIPMENT_MANIFEST('get'),
                axiosOption
            );
        },
        generateBulkInvoices(data, userinfo) {
            setUserIdCookie(userinfo);
            setComputronCookie();
            let axiosOption = Object.assign({},
                getCommonHeaderOptions(), {
                    data
                }
            );
            return ApiService.post(URLS.SHIPMENT_INVOICE('post'), axiosOption);
        },
        generateManifest(data, userinfo) {
            setUserIdCookie(userinfo);
            setComputronCookie();
            let axiosOption = Object.assign({},
                getCommonHeaderOptions(), {
                    data
                }
            );
            return ApiService.post(URLS.SHIPMENT_MANIFEST('post'), axiosOption);
        },

        // Utility functions
        getDueTime(shipment) {
            if (!shipment || !shipment.status.created_at) {
                return '';
            }
            const todayThresoldTime = moment({
                h: 10,
                m: 30
            });
            const tomorrowThresoldTime = moment({
                h: 10,
                m: 30
            }).add(24, 'h');
            const dayAfterThresoldTime = moment({
                h: 10,
                m: 30
            }).add(48, 'h');
            const isSaturday = moment().day() === 6;
            const isSunday = moment().day() === 0;

            let shipmentTimeObject = moment.unix(shipment.status.created_at);
            let thresoldTime;

            if (isSaturday) {
                thresoldTime =
                    todayThresoldTime.diff(shipmentTimeObject, 'h') > 0 ?
                    todayThresoldTime :
                    dayAfterThresoldTime;
            } else if (isSunday) {
                thresoldTime = tomorrowThresoldTime;
            } else {
                thresoldTime =
                    todayThresoldTime.diff(shipmentTimeObject, 'h') > 0 ?
                    todayThresoldTime :
                    tomorrowThresoldTime;
            }
            let dispatchTime = thresoldTime.add(3, 'h');

            let timeToDispatch = dispatchTime.diff(moment(), 'h', true);
            if (timeToDispatch > 0 && timeToDispatch < 8) {
                return `Due In ${Math.floor(timeToDispatch)} hours`;
            } else if (timeToDispatch >= 8 && timeToDispatch < 13.5) {
                return `Due Today at 1:30pm`;
            } else if (timeToDispatch >= 13.5 && timeToDispatch < 37) {
                return `Due Tomorrow at 1:30pm`;
            } else if (timeToDispatch >= 37) {
                return `Due at ${dispatchTime.format('DD MMM `YY')}`;
        } else {
            return 'SLA Breached';
        }
    },
    // DP Tracking
    shipmentDPTracking(shipment_id) {
        let axiosOption = Object.assign({}, { });
        return ApiService.get(URLS.SHIPMENT_DP_TRACKING(shipment_id), axiosOption);
    },
    // Check Shipment Refund
    checkShipmentRefund(shipment_id) {
        let axiosOption = Object.assign({}, { });
        return ApiService.get(URLS.SHIPMENT_CHECK_REFUND(shipment_id), axiosOption);
    },
    validateIFSC(params = {}) {
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(
            URLS.VALIDATE_IFSC_CODE(),
            axiosOption
        );
    },
    saveBankDetails(data, appId) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), {
            data
        });
        return ApiService.post(
            URLS.SAVE_BANK_DETAILS(appId),
            axiosOption
        );
    },
    getBankDetails(params, appId) {
        let axiosOption = Object.assign(
            {
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(
            URLS.GET_BANK_DETAILS(appId),
            axiosOption
        );
    },

    /** OMS v2.1 */
    callCustomer(params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(false),
            false,
            { params: params }
        );
        return ApiService.get(URLS.CALL(), axiosOption);
    },
    createS3Invoice(data){
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { data });
        return ApiService.post(URLS.CREATE_S3_INVOICE(), axiosOption);
    },
    changeStore(data) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { data });
        return ApiService.post(URLS.CHANGE_STORE(), axiosOption);
    },
    dispatchManifest(data){
        let axiosOption = Object.assign(
            {}, 
            getCommonHeaderOptions(false), 
            {
                data
            }
        );
        return ApiService.post(
            URLS.MANIFEST_DISPATCH(),
            axiosOption
        );
    },
    downloadBulkActionTemplate() {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(),
            { params: params }
        );
        return ApiService.get(URLS.DOWNLOAD_BULK_ACTION_TEMPLATE(), axiosOption);
    },
    fetchAnnouncementAlerts() {
        let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.FETCH_ANNOUNCEMENT_NOTE(), axiosOption);
    },
    fetchApplicationLaneV2Config(companyId, applicationId = null, params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(!!applicationId), 
            false, 
            {
                params: params
            }
        );
        return ApiService.get(URLS.LANE_APPLICATION_CONFIG_V2(), axiosOption);
    },
    fetchApplicationOrderV2Details(companyId, applicationId = null, params) {
        let axiosOption = Object.assign({},
            getCommonHeaderOptions(!!applicationId), false, {
                params: params
            }
        );
        return ApiService.get(URLS.ORDER_APPLICATION_DETAILS_V2(), axiosOption);
    },
    fetchApplicationOrdersV2List(companyId, applicationId = null, params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(!!applicationId), 
            false, 
            {
                params: params
            }
        );
        return ApiService.get(URLS.ORDERS_APPLICATION_V2_LISTING(), axiosOption);
    },
    fetchApplicationShipmentV2List(companyId, applicationId = null, params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(!!applicationId), 
            false, 
            {
                params: params
            }
        );
        return ApiService.get(URLS.SHIPMENT_APPLICATION_V2_LIST(), axiosOption);
    },
    fetchApplicationV2Filters(companyId, applicationId = null, params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(!!applicationId), 
            false, 
            {
                params: params
            }
        );
        return ApiService.get(URLS.FILTERS_APPLICATION_V2(), axiosOption);
    },
    fetchBulkActionFailedReport(params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(), 
            {
                params: params
            }
        );
        return ApiService.get(URLS.FETCH_BULK_ACTION_FAILED_REPORT(), axiosOption);
    },
    fetchBulkActionList(params) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { params: params });
        return ApiService.get(URLS.GET_BULK_ACTION_LIST(), axiosOption);
    },
    fetchBulkDownloadTemplateList() {
        let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.GET_BULK_DOWNLOAD_TEMPLATE_LIST(), axiosOption);
    },
    fetchBulkGenerateExcel(params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(), {
                params: params
            }
        );
        return ApiService.get(URLS.FETCH_V2_BULK_GENERATE_EXCEL(), axiosOption);
    },
    fetchBulkListDetailedData(params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(), 
            {params: params}
        );
        return ApiService.get(URLS.FETCH_BULK_LIST_DETAILED_DATA(), axiosOption);
    },
    fetchDpActivityLogs(params) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { params: params });
        return ApiService.get(URLS.GET_DP_ACTIVITY_LOGS(), axiosOption);
    },
    fetchLaneV2Config(companyId, applicationId = null, params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(!!applicationId), 
            false, 
            {
                params: params
            }
        );
        return ApiService.get(URLS.LANE_CONFIG_V2(), axiosOption);
    },
    fetchManifestDetails(params) {
        let axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(),
            { params: params }
        );
        return ApiService.get(URLS.FETCH_MANIFEST_DETAILS(), axiosOptions);
    },
    fetchManifestList(params) {
        let axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(false),
            {
                params: params
            }
        );
        return ApiService.get(URLS.FETCH_MANIFEST_LIST(), axiosOptions);
    },
    fetchOrderUserRoles(){
        let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.ORDER_ROLE(), axiosOption);
    },
    fetchOrderV2Details(companyId, applicationId = null, params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(!!applicationId), 
            false, 
            {
                params: params
            }
        );
        return ApiService.get(URLS.ORDER_DETAILS_V2(), axiosOption);
    },
    fetchOrdersV2List(companyId, applicationId = null, params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(!!applicationId), 
            false, 
            {
                params: params
            }
        );
        return ApiService.get(URLS.ORDERS_V2_LISTING(), axiosOption);
    },
    fetchPickupSlot(data){
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(false), 
            false, 
            {
                params: data
            }
        );
        return ApiService.get(URLS.FETCH_PICKUP_SLOT(), axiosOption);
    },
    fetchQCReasons(shipmentId, bagId) {
        let axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(false)
        );
        return ApiService.get(URLS.FETCH_QC_REASONS(shipmentId, bagId), axiosOptions);
    },
    fetchReassignedStoreReasons(shipmentId, bagId) {
        let axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(false)
        );
        return ApiService.get(URLS.FETCH_REASSIGN_STORE_REASONS(shipmentId, bagId), axiosOptions);
    },
    fetchShipmentActivityLogs(params) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { params: params });
        return ApiService.get(URLS.GET_SHIPMENT_ACTIVITY_LOGS(), axiosOption);
    },
    fetchShipmentV2List(companyId, applicationId = null, params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(!!applicationId), 
            false, 
            {
                params: params
            }
        );
        return ApiService.get(URLS.SHIPMENT_V2_LIST(), axiosOption);
    },
    fetchV2Filters(companyId, applicationId = null, params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(!!applicationId), 
            false, 
            {
                params: params
            }
        );
        return ApiService.get(URLS.FILTERS_V2(), axiosOption);
    },
    generateManifestList(){
        let axiosOption = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.MANIFEST_LISTING(), axiosOption);
    },
    getBulkInvoiceReport(params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(), 
            {
                params: params
            }
        );
        return ApiService.get(URLS.FETCH_BULK_INVOICE_REPORT(), axiosOption);
    },
    getFulfillmentCenterV2(params, companyId) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { params: params });
        return ApiService.get(URLS.GET_FULFILLMENT_CENTER(companyId), axiosOption);
    },
    getReasons(shipmentId, bagId, state) {
        let axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(false)
        );
        return ApiService.get(URLS.FETCH_REASONS(shipmentId, bagId, state), axiosOptions);
    },
    getStatesForBagTranistion() {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false));
        return ApiService.get(URLS.GET_STATES_FOR_TRANSITION(), axiosOption);
    },
    getStores(params) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { params: params });
        return ApiService.get(URLS.GET_STORES(), axiosOption);
    },
    hitEInvoice(data) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { data });
        return ApiService.post(URLS.HIT_E_INVOICE(), axiosOption);
    },
    lockManager(data){
        let axiosOption = Object.assign({},getCommonHeaderOptions(), { data });
        return ApiService.post(URLS.LOCK_MANAGER_URL(), axiosOption)
    },
    getDownloadTemplate(params) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { params: params });
        return ApiService.get(URLS.GET_TEMPLATE(), axiosOption);
    },
    postLinkV2BulkAction(data) {
        let axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(),
            { data }
        );

        return ApiService.post(URLS.POST_V2_LINK_BULK_ACTION(), axiosOptions);
    },
    postSelectedDeliveryPartner(data) {
        let axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(),
            { data }
        );
        return ApiService.post(URLS.POST_V2_SELECTED_DELIVERY_PARTNER(), axiosOptions);
    },
    processBulkActionInvoice(params) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(), 
            {
                params: params
            }
        );
        return ApiService.get(URLS.PROCESS_BULK_ACTION_INVOICE(), axiosOption);
    },
    processManifest(data) {
        let axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(),
            { data }
        );
        return ApiService.post(URLS.PROCESS_MANIFESTS(), axiosOptions);
    },
    saveProcessManifest(companyId, data) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { data });
        return ApiService.post(URLS.SAVE_PROCESS_MANIFEST(companyId), axiosOption);
    },
    sendSms(data) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { data });
        return ApiService.post(URLS.SEND_SMS(), axiosOption);
    },
    updateAddress(data) {
        let axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(),
            { data }
        );
        return ApiService.post(URLS.UPDATE_ADDRESS(), axiosOptions);
    },
    uploadConsent(data) {
        let axiosOptions = Object.assign(
            {},
            getCommonHeaderOptions(),
            { data }
        );
        return ApiService.post(URLS.UPLOAD_CONSENT(), axiosOptions);
    },
    updatePackagingDimensions(data){
        let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { data });
        return ApiService.post(URLS.UPDATE_PACKAGE_DIMENSION(), axiosOption);
    },
    updateShipmentStatus(data) {
        let axiosOption = Object.assign(
            {},
            getCommonHeaderOptions(),
            { data }
        );
        return ApiService.put(
            URLS.UPDATE_SHIPMENT_STATUS(),
            axiosOption
        );
    }
    /** OMS v2.1 --END */
};
export default OrderService;