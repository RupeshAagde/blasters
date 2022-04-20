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
        fetchOrderLanesCount(comapnyId, params) {
            let axiosOption = Object.assign({},
                getCommonHeaderOptions(!!params.app_id), {
                    params: params
                }
            );
            return ApiService.get(URLS.ORDER_LANES_COUNT(comapnyId), axiosOption);
        },
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
        getShipmentAddress(params) {
            const { shipment_id, address_category } = params;
            let axiosOption = Object.assign({}, getCommonHeaderOptions());
            return ApiService.get(
                URLS.ORDER_SHIPMENTS_ADDRESS(shipment_id, address_category),
                axiosOption
            );
        },
        updateShipmentAddress(params, data) {
            const { shipment_id, address_category } = params;
            let axiosOption = Object.assign({}, getCommonHeaderOptions(false), { data });
            return ApiService.post(
                URLS.ORDER_SHIPMENTS_ADDRESS(shipment_id, address_category),
                axiosOption
            );
        },
        updateShipmentStatus(data) {
            let axiosOption = Object.assign({}, getCommonHeaderOptions(false), {
                data
            });
            return ApiService.post(
                URLS.ORDER_SHIPMENTS_STATUS_UPDATE(),
                axiosOption
            );
        },
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
};
export default OrderService;