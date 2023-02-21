'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import OrderShipmentList from '@/pages/oms/index.vue';
// import ManifestList from '@/pages/admin/oms/generate-manifest.vue';
import AdvancedFilterDrawer from '@/pages/oms/advanced-filter-drawer.vue';
import ShipmentListItem from '@/pages/oms/shipment-list-item.vue'
// import OrderListItem from '@/pages/admin/oms/order-list-item.vue'
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// import ADMIN_URLS from '@/services/admin/admin-url.service';
import URLS from '@/services/domain.service';
import MOCK_INDEX_DATA from './fixtures/mock-index.data.json'
// import mockData from './../marketplaces/marketplaces-mock.json';
// import ACCESS_MOCK_DATA from './../../../../fixtures/access-data.json';
import ACCESS_MOCK_DATA from './fixtures/access-data-oms.json';
// import moment from 'moment';
// import cloneDeep from 'lodash/cloneDeep';

import flushPromises from "flush-promises";
import { wrap } from 'lodash';
let localVue;
let ordersKaData;
const mock = new MockAdapter(axios);
let wrapper, router
const companyId = '1';

const CsvView = {
    render: () => {},
    methods: {
        createGrid: () => {},
        removeGrid: () => {},
    },
    data() {
        return {
            grid: {
                gridOptions: {
                    onCellClicked: () => {},
                    onCellEditingStarted: () => {},
                    onCellValueChanged: () => {},
                    onRowSelected: () => {},
                    getRowClass: () => {},
                    api: {
                        redrawRows: () => {},
                        getSelectedRows: () => {
                            return [];
                        },
                    },
                },
            },
        };
    },
};

describe('Order/Shipment List Page', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.SHIPMENT_V2_LIST(MOCK_INDEX_DATA.shipmentParams)).reply(200, MOCK_INDEX_DATA.shipmentsResponseData);
        mock.onGet(URLS.GET_COMPANY_LIST({})).reply(200, MOCK_INDEX_DATA.companyListResponseData);
        mock.onGet(URLS.ORDERS_V2_LISTING(MOCK_INDEX_DATA.ordersPrarams)).reply(200, MOCK_INDEX_DATA.ordersResponseData);
        mock.onGet(URLS.GET_FULFILLMENT_CENTER(MOCK_INDEX_DATA.fulfillmentCentreParams)).reply(200, MOCK_INDEX_DATA.FulfillmentCentreResponseData);
        mock.onGet(URLS.FILTERS_V2(companyId, null, MOCK_INDEX_DATA.filtersParams)).reply(200, MOCK_INDEX_DATA.filtersResponseData);
        mock.onGet(URLS.LANE_CONFIG_V2(companyId, null, MOCK_INDEX_DATA.laneConfigParams)).reply(200, MOCK_INDEX_DATA.laneResponseData)
        mock.onGet(URLS.FETCH_ANNOUNCEMENT_NOTE()).reply(200, MOCK_INDEX_DATA.announcementsResponseData);
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders/', name: 'company-orders-v2', component: ShipmentListItem },
                { path: '/company/:company_id/orders/:orderId/details', name: 'company-order-details-v2', component: ShipmentListItem},
            ]
        })
        router.push(`/company/1/orders`);
        // router.push('/company/1/orders/manifest/:storeId')
        wrapper = mount(OrderShipmentList, {
            localVue,
            router,
            data() {
                return {
                    laneIndex: 1,
                    selectedView: "shipment",
                    params: MOCK_INDEX_DATA.ordersPrarams,
                    data: MOCK_INDEX_DATA.shipmentsResponseData.items,
                    orderLaneData: [],
                    selectedStageTabIndex: 0,
                    selectedStageTab: 'unfulfilled',
                    orderDateRange: [
                        1,
                        2,
                    ],
                    autoRefresh: false,
                    autoRefreshId: null,
                    order: MOCK_INDEX_DATA.ordersResponseData,
                }
            },
            stubs: {
                'csv-view': CsvView,
            },
            computed: {
                accessDetail: () => ACCESS_MOCK_DATA,
            }
        });
        await flushPromises();
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('is a Vue instance', () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('pagination data', async() => {
        wrapper.setData({
            inProgress: false,
            pagination: {
                limit: 10,
                current: 1,
                total: 0,
            },
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.pagination-main');

        copyClick.vm.$emit('change', {
            "limit": 20,
            "current": 1,
            "total": 81
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.pagination.total).toBe(81);
    });

    // it('refresh icon is clicked it fetched all the new data and reloads all the data', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'searchOrders');
    //     await flushPromises();
    //     wrapper.setData({
    //         orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const copyClick = wrapper.find('.refresh-icon');
    //     copyClick.trigger('click');
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // });

    // it('when the button is clicked it navigates to the manifest page (when fullfilment store is not selected)', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'navigateToManifest');
    //     await flushPromises();
    //     wrapper.setData({
    //         orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
    //         lane: 'ready_for_dispatch',
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const ManifestButClick = wrapper.find('.button-manifest')
    //     ManifestButClick.vm.$emit('click');
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // });

    // it('when the button is clicked it navigates to the manifest page (when fullfilment store is selected)', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'navigateToManifest');
    //     await flushPromises();
    //     wrapper.setData({
    //         orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
    //         lane: 'ready_for_dispatch',
    //         selectedStore: 'jio-location (jio-location)'
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const ManifestButClick = wrapper.find('.button-manifest')
    //     ManifestButClick.vm.$emit('click');
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // });

    it('When clicked the filter image, it opens the advanced filter section', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'advancedFilterSection');
        await flushPromises();
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.advanced-filter');
        copyClick.trigger('click');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

    it('Whener the lane is changed this method is called "changeLaneType', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'changeLaneType');
        await flushPromises();
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
            activeLaneIndex: 1,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.lane-types');
        copyClick.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.activeLaneIndex).toBe(0);
    });

    it('it changes view as per the user (for example: shipment view to bulk view)', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'changeView');
        await flushPromises();
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.views');
        copyClick.vm.$emit('change', wrapper.vm.selectedView);
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalledWith(wrapper.vm.selectedView);
    });    

    // it('it searches each and every alphabet searched in fullfilment store filter', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'searchStore');
    //     await flushPromises();
    //     wrapper.setData({
    //         inProgress: false,
    //         isInitialLoad: false,
    //         orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const copyClick = wrapper.findComponent({ref:'search-company-dropdown'});
    //     console.log(copyClick)
    //     copyClick.vm.$emit('searchCompany', "jio");
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // }); 

    it('it searches each and every alphabet searched in fullfilment store filter', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'searchStore');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            isInitialLoad: false,
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.findComponent({ref:'search-store-dropdown'});
        copyClick.vm.$emit('searchInputChange', "jio");
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    }); 

    it('it calls the apiFunction', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'callApiFunctions');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            pageError: true,
            selectedView: 'orders'
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let a = wrapper.findComponent({ref:'call-api-function'})
        a.vm.$emit('tryAgain', "orders");
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    }); 

    it('it calls the apiFunction', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'callApiFunctions');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            pageError: true,
            selectedView: 'shipment'
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let a = wrapper.findComponent({ref:'call-api-function'})
        a.vm.$emit('tryAgain', "shipment");
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

    it('it calls the clearSearchNCall', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'clearSearchNCall');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            isInitialLoad: false,
            search: 'hi'
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.date-picker-sqaure');
        copyClick.trigger('click', "clearSearchNCall");
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

    // it('it calls the setAutoRefresh', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'setAutoRefresh');
    //     await flushPromises();
    //     wrapper.setData({
    //         inProgress: false,
    //         isInitialLoad: false,
    //         autoRefresh: true,
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const copyClick = wrapper.find('.pad-right');
    //     copyClick.vm.$emit('change');
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // });

    // it('it calls the setAutoRefresh', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'setAutoRefresh');
    //     await flushPromises();
    //     wrapper.setData({
    //         inProgress: false,
    //         isInitialLoad: false,
    //         autoRefresh: false
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const copyClick = wrapper.find('.pad-right');
    //     copyClick.vm.$emit('change');
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // });

    // it('should trigger beforeRouteEnter event', function () {
    //     const spy = jest.spyOn(wrapper.vm.$options.beforeRouteEnter, '0'); // you can't just call view.vm.beforeRouteEnter(). The function exists only in $options object.
      
    //     const from = {}; // mock 'from' route
    //     const to = {}; // mock 'to' route
    //     wrapper.vm.$options.beforeRouteEnter[0](to, from, cb => cb(view.vm));
      
    //     expect(wrapper.vm.entered).to.be.true;
    //     expect(spy).to.have.been.called;
    //   });

    // it('fetch orders method', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'fetchOrders');
    //     await flushPromises();

    //     let a = wrapper.vm.fetchOrders()
    //     await flushPromises();
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // }); 

    it('it searches each and every alphabet searched in fullfilment store filter', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'selectStageTab');
        await flushPromises();
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
            selectedStageTabIndex: 1,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.tab-item-custom');
        copyClick.trigger('click', 1, {
            "text": "Processed",
            "value": "processed",
            "options": [
                {
                    "text": "In transit",
                    "value": "in_transit",
                    "total_items": 0,
                    "index": 5,
                    "actions": []
                },
                {
                    "text": "Handed Over to Customer",
                    "value": "handed_over_to_customer",
                    "total_items": 0,
                    "index": 6,
                    "actions": []
                },
                {
                    "text": "Delivery Done",
                    "value": "delivered",
                    "total_items": 0,
                    "index": 7,
                    "actions": []
                },
                {
                    "text": "Cancelled",
                    "value": "cancelled",
                    "total_items": 0,
                    "index": 8,
                    "actions": []
                }
            ],
            "total_items": 0
        });
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    }); 

    it('it changes the pagination method when the pagination is changed by the user', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'paginationChange');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            selectedView: 'orders',
            orders: MOCK_INDEX_DATA.ordersResponseData.items,
            shipmentData: MOCK_INDEX_DATA.shipmentsResponseData.items,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.pagination-main');
        copyClick.vm.$emit('change', {
            "limit": 5,
            "current": 2,
            "total": 70
        });
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    }); 

    it('it changes the types of filters to be applied (for example: chosing search type as shipment id)', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'changeFilterType');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            isInitialLoad: false,
            filterType: 'shipment_id',
            searchShipmentFilter: [
                {
                    "text": "Auto",
                    "value": "auto",
                    "placeholder_text": "Search by Shipment ID, SKU, Order ID, AWB ,Mobile & Email"
                },
                {
                    "text": "Shipment ID",
                    "value": "shipment_id",
                    "placeholder_text": "Search by Shipment ID"
                },
                {
                    "text": "Order No",
                    "value": "order_id",
                    "placeholder_text": "Search by Order ID"
                },
                {
                    "text": "Customer Name",
                    "value": "customer_name",
                    "placeholder_text": "Search by Customer Name"
                },
                {
                    "text": "Customer Email",
                    "value": "email",
                    "placeholder_text": "Search by Customer Email"
                },
                {
                    "text": "AWB Number",
                    "value": "awb_no",
                    "placeholder_text": "Search by AWB Number"
                },
                {
                    "text": "Invoice Id",
                    "value": "invoice_id",
                    "placeholder_text": "Search by Invoice Id"
                },
                {
                    "text": "EAN",
                    "value": "ean",
                    "placeholder_text": "Search by EAN"
                },
                {
                    "text": "SKU",
                    "value": "sku",
                    "placeholder_text": "Search by SKU"
                }
            ]
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.filter-type');
        copyClick.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    }); 

    // it('it searches each and every alphabet searched in fullfilment store filter', async () => {
    //     wrapper.setData({
    //         shipmentData: MOCK_INDEX_DATA.shipmentsResponseData.items,
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     let a = wrapper.vm.fetchShipments()
    //     await wrapper.vm.$nextTick();
    //     expect(a).toBeTruthy();
    // }); 

    // it('it searches each and every alphabet searched in fullfilment store filter', async () => {
    //     mock.onGet(URLS.SHIPMENT_V2_LIST(MOCK_INDEX_DATA.shipmentParams)).reply(500, {})

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     let a = wrapper.vm.fetchShipments()
    //     await wrapper.vm.$nextTick();
    //     expect(a).toBeTruthy();
    // }); 

    it('it closes the advanded filters slide when clicked', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'close');
        await flushPromises();
        wrapper.setData({
            advancedFilterView: true,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.slide-fade');
        copyClick.trigger('click');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });  

    // it('it shows the data of the date range selected', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'dateRangeChange');
    //     await flushPromises();
    //     console.debug(wrapper.vm.orderDateRange[1])
    //     wrapper.setData({
    //         inProgress: false,
    //         isInitialLoad: false,
    //         notBefore: moment().subtract(3, 'months').toISOString(),
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const copyClick = wrapper.find('.date-picker');
    //     copyClick.vm.$emit('input');
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // }); 

    // // THE BELOW TEST CASE CAN BE USED IN FUTURE... SO DONT DELETE IT---------
    // // it('it checks if its a FP app or not', async () => {
    // //     const clickEvent = jest.spyOn(wrapper.vm, 'resetFilter');
    // //     await flushPromises();
    // //     wrapper.setData({
    // //         inProgress: false,
    // //         isInitialLoad: false,
    // //     });

    // //     await wrapper.vm.$forceUpdate();
    // //     await wrapper.vm.$nextTick();

    // //     const copyClick = wrapper.find('.row-filter');
    // //     copyClick.vm.$emit('click');
    // //     await wrapper.vm.$nextTick();
    // //     expect(clickEvent).toHaveBeenCalled();
    // // }); 

    it('it will apply the advanced filters chosen by the user', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'applyAdvancedFilters');
        await flushPromises();
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.slide-adv-filter');
        copyClick.vm.$emit('applyFilters', {
            "closeDrawer": true,
            "data": {
                "bag_status": [
                    "bag_confirmed",
                    "bag_invoiced"
                ]
            }
        }, {}, true, false);
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    }); 

    it('it detects any keyboard event has been done by the user', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'onSearchInput');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            isInitialLoad: false,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.search');
        copyClick.vm.$emit('keyup', {
            "isTrusted": true,
            keyCode: 13
        });
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    }); 

    // it('it detects any keyboard event has been done by the user', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'onSearchBlur');
    //     await flushPromises();
    //     wrapper.setData({
    //         inProgress: false,
    //         isInitialLoad: false,
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const copyClick = wrapper.find('.search');
    //     copyClick.vm.$emit('blur', {
    //         "isTrusted": true,
    //         target: {value: "16589124715791661046K"}
    //     });
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // });

    // it('it checks the and updates the role type of the user', async () => {
    //     let a = wrapper.vm.checkUpdateRole;

    //     await flushPromises();
    //     await wrapper.vm.$nextTick();

    //     expect(a).toBeTruthy();

    //     // expect(computed.checkUpdateRole.call(localThis)).toBe("1, 3, 5, 7, 9")

    // });

    // // BELOW TEST CASES ARE FOR ADVANCED-FILTER-DRAWER COMPONENT -------------------------------------------------------------------

    it('it finds the child component we want and runs the onMultiSelectChange method in it', async () => {
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
            selectedAdvancedFilters: {},
            // selectedFilters: {}
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer)
        let a = childComponent.find('.advanced-filter-dropdown')
        a.vm.$emit('change', [
            "000000000000000000000001"
        ], 'sales_channel')

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(true);
        // expect(a).toBe({ sales_channel: [ '000000000000000000000001' ] });
    }); 

    it('it search the input written by the user and calls searchFilterOptions function', async () => {
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
            selectedAdvancedFilters: {},
            // selectedFilters: {}
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer)
        let a = childComponent.find('.advanced-filter-dropdown')
        a.vm.$emit('searchInputChange', {
            "id": "nitrozen-dropdown-3oxvs9h1",
            "text": "express"
        }, 0)

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(true);
        // expect(a).toBe({ sales_channel: [ '000000000000000000000001' ] });
    }); 

    it('it will remove the chips of the particular advanced filter selected by the user', async () => {
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
            selectedAdvancedFilters: {},
            // selectedFilters: {}
            // selectedFiltersOptions: {
            //     "payment_mode": [
            //         "COD"
            //     ]
            // },
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer)

        // let a = childComponent.find('.main-wrapper')
        // console.log(a)
        childComponent.vm.removeChip([
            "payment_mode"
        ], -1)
        // a.vm.$emit('click', [
        //     "payment_mode"
        // ], 1)

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(true);
    }); 

    it('it calls the stopClick method', async () => {
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
            selectedAdvancedFilters: {},
        });

        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer)

        let a = childComponent.find('.filters-section')
        a.trigger('click')

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(true);
    }); 

    // it('it calls the checkOutsideClick method', async () => {
    //     jest.spyOn(wrapper.vm, 'closest').mockImplementationOnce(() => true)

    //     wrapper.setData({
    //         advancedFilterView: true,
    //         advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
    //         selectedAdvancedFilters: {},
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();
        
    //     const childComponent = wrapper.findComponent(AdvancedFilterDrawer)

    //     let a = childComponent.find('.filters-section')

    //     a.vm.$emit('checkOutsideClick', {
    //         "isTrusted": true,
    //         "target": 'advanced-filter-dropdown'
    //     })


    //     await wrapper.vm.$nextTick();
    //     expect(wrapper.vm.advancedFilterView).toBe(true);
    // }); 

    it('it will call the resetFilters method and it will reset all the advanced filters applied by the user', async () => {
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
            selectedAdvancedFilters: {},
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer)

        let a = childComponent.find('.clear-button')
        a.vm.$emit('click', {stopPropagation: ()=>{}})

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(true);
    }); 

    it('it will apply the advanced filters chosen by the user', async () => {
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
            selectedAdvancedFilters: {},
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer)

        let a = childComponent.find('.apply-filter-button')
        a.vm.$emit('click', {stopPropagation: ()=>{}})

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(true);
    }); 

    // it('it will get the selected filters', async () => {
    //     wrapper.setData({
    //         advancedFilterView: true,
    //         advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
    //         selectedAdvancedFilters: {},
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();
        
    //     let a = wrapper.vm.getSelectedFilterText;

    //     await flushPromises();
    //     await wrapper.vm.$nextTick();

    //     expect(a).toBeTruthy();
    // }); 

    // BELOW TEST CASES ARE FOR SHIPMENT LIST ITEM COMPONENT -------------------------------------------------------------------

    it('it will just pass all the props to shipment list item component', async () => {
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
            selectedView: 'shipment',
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(ShipmentListItem)
        let a = childComponent.find('.line-break')
        
        await wrapper.vm.$nextTick();
        expect(childComponent.vm.shipmentList.length).toBeGreaterThanOrEqual(0);
    }); 

    it('it will just pass all the props to shipment list item component', async () => {
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
            selectedView: 'shipment',
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(ShipmentListItem)
        let a = childComponent.find('.line-break')
        a.trigger('click', 'FY62E38B3801C15856C1', '16590794807021683429K')

        await wrapper.vm.$nextTick();
        expect(childComponent.vm.shipmentList.length).toBeGreaterThanOrEqual(0);
    }); 

    // it('it will give the sum of the price of all the bags ', async () => {
    //      // const clickEvent = jest.spyOn(childComponent.vm, 'sumOfBagsPrice');
    //     wrapper.setData({
    //         orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
    //         selectedView: 'shipment',
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();
        
    //     const childComponent = wrapper.findComponent(ShipmentListItem)
    //     let a = childComponent.find('.line-break')
       
    //     a.trigger('click', MOCK_INDEX_DATA.shipmentsResponseData.items[0].bags)
    //     await wrapper.vm.$nextTick();

    //     let returnData = childComponent.vm.sumOfBagsPrice(MOCK_INDEX_DATA.shipmentsResponseData.items[0].bags)
    //     expect(returnData).toBe(499);
    // }); 

    it('it will open the bag dialog view', async () => {
       wrapper.setData({
           orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
           selectedView: 'shipment',
       });

       await wrapper.vm.$forceUpdate();
       await wrapper.vm.$nextTick();
       
       const childComponent = wrapper.findComponent(ShipmentListItem)
       let a = childComponent.find('.item-images')

       a.trigger('click.stop', MOCK_INDEX_DATA.shipmentsResponseData.items[0])
       await wrapper.vm.$nextTick();

       expect(childComponent.vm.bagDialogView).toBe(true);
    });
    
    // it('it will return SLA percentage', async () => {
    //     wrapper.setData({
    //         orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
    //         selectedView: 'shipment',
    //     });
 
    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();
        
    //     const childComponent = wrapper.findComponent(ShipmentListItem)

    //     let a = childComponent.findComponent({ref:'sla-indicator'})
    //     a.trigger('sla_percent', MOCK_INDEX_DATA.shipmentsResponseData.items[0].shipment_status.status_created_at, MOCK_INDEX_DATA.shipmentsResponseData.items[0].shipment_status.meta.estimated_sla_time)
    //     await wrapper.vm.$nextTick();
        
    //     let returnData = childComponent.vm.displaySlaPercentage(MOCK_INDEX_DATA.shipmentsResponseData.items[0].shipment_status.shipment_created_at, MOCK_INDEX_DATA.shipmentsResponseData.items[0].shipment_status.meta.estimated_sla_time)
    //     expect(childComponent.vm.bagDialogView).toBe(false);

    //     // Actually we have to use the below expect statement ... but due to its dynamic nature (changes everytime as its connected to time) we are using above statement
    //     // expect(returnData).toBe(118.41188972825881);
    // });

    it('it will return SLA hours left', async () => {
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
            selectedView: 'shipment',
        });
 
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(ShipmentListItem)

        let a = childComponent.find('.sla-time')
        
        let returnData = childComponent.vm.displaySlaHoursLeft(MOCK_INDEX_DATA.shipmentsResponseData.items[0].shipment_status.meta.estimated_sla_time)
        expect(returnData).toBe(returnData);
    });

    it('it will copy the data on clipboard when the shipment id is clicked upon', async () => {
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
            selectedView: 'shipment',
        });
 
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(ShipmentListItem)

        let a = childComponent.find('.sla-time')
        
        let returnData = childComponent.vm.displaySlaHoursLeft(MOCK_INDEX_DATA.shipmentsResponseData.items[0].shipment_status.meta.estimated_sla_time)
        expect(returnData).toBe(returnData);
    });
   
    it('shipment listing fails data', async() => {
        mock.onGet(URLS.SHIPMENT_V2_LIST(companyId)).reply(500, {});
        await flushPromises();
        expect(wrapper.vm.shipmentData.length).toBeGreaterThanOrEqual(0);
    });

    // // it('dateRangeChange', async() => {
    // //     wrapper.vm.dateRangeChange();
    // //     await flushPromises();
    // //     expect(wrapper.vm.orders.length).toBeGreaterThanOrEqual(1);
    // // });
    // // it('filterChange', async() => {
    // //     wrapper.vm.filterChange();
    // //     await flushPromises();
    // //     expect(wrapper.vm.orders.length).toBeGreaterThanOrEqual(1);
    // // });
    // // it('searchStore', async() => {
    // //     wrapper.vm.searchStore('test');
    // //     await wrapper.vm.$nextTick();

    // //     wrapper.vm.searchStore('');
    // //     await wrapper.vm.$nextTick();
    // // });

    // // it('searchOrders', async() => {
    // //     wrapper.vm.searchOrders();
    // //     await wrapper.vm.$nextTick();
    // // });

    // // it('selectStageTab', async() => {
    // //     wrapper.vm.selectStageTab({ index: 1 });
    // //     await wrapper.vm.$nextTick();
    // // });


    // // it('error image', async () => {
    // //     await flushPromises();
    // //     wrapper.vm.getErrorImage({'profile_pic': ''});
    // //     wrapper.vm.$nextTick();
    // // });

    // TEST CASES FOR BULK FOLDER PICKLIST.VUE COMPONENT 

    // it('it calls the hideInvoiceError method', async () => {
    //     const childComponent = wrapper.findComponent(OrderBulkPicklist)
        
    //     const clickEvent = jest.spyOn(childComponent.vm, 'hideInvoiceError');
    //     await flushPromises();

    //     const copyClick = childComponent.find('.error');
    //     copyClick.vm.$emit('close');
    //     await childComponent.vm.$nextTick();
    //     expect(childComponent.vm.showInvoiceError).toBeFalsy();
    // }); 

    // // it('it calls the generateBulkInvoice method if the selectedStore is not selected', async () => {
    // //     const childComponent = wrapper.findComponent(OrderBulkPicklist)
        
    // //     const clickEvent = jest.spyOn(childComponent.vm, 'generateBulkInvoice');
    // //     await flushPromises();
    // //     childComponent.setData({
    // //         toggleBulkInvoice: true
    // //     });
    // //     await wrapper.vm.$forceUpdate();
    // //     await wrapper.vm.$nextTick();

    // //     const copyClick = childComponent.find('.icons-item');
    // //     copyClick.trigger('click');
    // //     await childComponent.vm.$nextTick();
    // //     expect(childComponent.vm.selectedStore).toBe("");
    // // }); 

    // // it('it calls the generateBulkInvoice method if the selectedStore is selected', async () => {
    // //     // wrapper = shallowMount(OrderBulkPicklist, {
    // //     //     localVue,
    // //     //     router,
    // //     //     stubs: {
    // //     //         'csv-view': CsvView,
    // //     //     },
    // //     //     // computed: {
    // //     //     //     accessDetail: () => ACCESS_MOCK_DATA,
    // //     //     //     registeredMarketplaces: () => MARKETPLACE_DATA,
    // //     //     //     companyApplications: () => APPLICATION_LIST_MOCK_DATA.items,
    // //     //     // },
    // //     // });
    // //     // await flushPromises();

    // //     const childComponent = wrapper.findComponent(OrderBulkPicklist)
    // //     console.log(childComponent)

    // //     // const mock = jest.fn(() => [
    // //     //     {
    // //     //         "shipment_id": "16606397866641780167K",
    // //     //         "bag_total": 1,
    // //     //         "order_date": "2022-08-16T14:19:47+00:00",
    // //     //         "brand_name": "Generic",
    // //     //         "bag_ids": [
    // //     //             null
    // //     //         ],
    // //     //         "qty_obj": [
    // //     //             {
    // //     //                 "identifier": "32132142133",
    // //     //                 "quantity": 1
    // //     //             }
    // //     //         ],
    // //     //         "price": 300,
    // //     //         "mrp": 500,
    // //     //         "payment_mode": "PREPAID",
    // //     //         "current_status": "bag_invoiced",
    // //     //         "actual_current_status": "bag_invoiced",
    // //     //         "display_current_status": "Bag Invoiced",
    // //     //         "awb_no": "NA",
    // //     //         "dp_name": "NA",
    // //     //         "customer_name": "prudhvi",
    // //     //         "delivery_city": "Mumbai",
    // //     //         "customer_number": "9618835991",
    // //     //         "delievery_pincode": "400022",
    // //     //         "address": "2,Bangalore,Karnataka,Mumbai,Maharashtra,400022",
    // //     //         "channel": "Jiomarket",
    // //     //         "channel_shipment_id": "16606397866641780167K",
    // //     //         "seller_identifier": "EAN:32132142133",
    // //     //         "sku_code": "32132142133",
    // //     //         "gstin": null,
    // //     //         "order_id": "FY62FB5A2A01311CB73C",
    // //     //         "store_invoice_id": "00000008AA000070",
    // //     //         "actual_store_invoice_id": "00000008AA000070",
    // //     //         "fulfillment_store": "jio-location"
    // //     //     }
    // //     // ]) 
    // //     // wrapper.vm.$refs['csv-picklist'].grid.gridOptions.api.getSelectedRows = 
        
    // //     const clickEvent = jest.spyOn(childComponent.vm, 'generateBulkInvoice');
    // //     await flushPromises();
    // //     childComponent.setData({
    // //         toggleBulkInvoice: true
    // //     });
    // //     await wrapper.vm.$forceUpdate();
    // //     await wrapper.vm.$nextTick();

    // //     childComponent.setProps({
    // //         selectedStore: 8
    // //     });
    // //     await wrapper.vm.$forceUpdate();
    // //     await wrapper.vm.$nextTick();

    // //     childComponent.vm.generateBulkInvoice()
    // //     // const copyClick = childComponent.find('.action-btn');
    // //     // console.log(copyClick)
    // //     // copyClick.trigger('click');
    // //     await childComponent.vm.$nextTick();
    // //     expect(childComponent.vm.selectedStore).toBe("");
    // // }); 

    // // it('it calls the action-btn method', async () => {
    // //     const childComponent = wrapper.findComponent(OrderBulkPicklist)
        
    // //     // const clickEvent = jest.spyOn(childComponent.vm, 'action-btn');
    // //     // await flushPromises();
    // //     childComponent.setData({
    // //         toggleBulkInvoice: true
    // //     });
    // //     await wrapper.vm.$forceUpdate();
    // //     await wrapper.vm.$nextTick();

    // //     const copyClick = childComponent.find('.action-btn');
    // //     console.log(copyClick)
    // //     copyClick.trigger('click');
    // //     await childComponent.vm.$nextTick();
    // //     expect(childComponent.vm.showInvoiceError).toBeFalsy();
    // // }); 

})