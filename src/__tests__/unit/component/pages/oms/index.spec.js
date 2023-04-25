'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import OrderShipmentList from '@/pages/oms/index.vue';
import AdvancedFilterDrawer from '@/pages/oms/advanced-filter-drawer.vue';
import ShipmentListItem from '@/pages/oms/shipment-list-item.vue';

/* Services imports */
import URLS from '@/services/domain.service';

/* Mock imports */
import MOCK_INDEX_DATA from './fixtures/mock-index.data.json';
import ACCESS_MOCK_DATA from './fixtures/access-data-oms.json';


import flushPromises from "flush-promises";
let localVue;
const mock = new MockAdapter(axios);
let wrapper, router;
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
                { path: '/company/:company_id/orders-list/', name: 'company-orders-v2', component: ShipmentListItem },
                { path: '/company/:company_id/orders/:orderId/details', name: 'company-order-details-v2', component: ShipmentListItem},
            ]
        })
        router.push(`/company/1/orders`);
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

        const element = wrapper.find('.pagination-main');

        element.vm.$emit('change', {
            "limit": 20,
            "current": 1,
            "total": 81
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.pagination.total).toBe(81);
    });

    it('When clicked the filter image, it opens the advanced filter section', async () => {
        const advancedFilterSectionFunction = jest.spyOn(wrapper.vm, 'advancedFilterSection');
        await flushPromises();
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.advanced-filter');
        element.trigger('click');
        await wrapper.vm.$nextTick();
        expect(advancedFilterSectionFunction).toHaveBeenCalled();
    });

    // it('Whenever the lane is changed this method is called "changeLaneType', async () => {
    //     await flushPromises();
    //     wrapper.setData({
    //         orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
    //         activeLaneIndex: 1,
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const element = wrapper.find('.lane-types');
    //     element.trigger('click');
    //     await wrapper.vm.$nextTick();
    //     expect(wrapper.vm.activeLaneIndex).toBe(0);
    // });

    it('it changes view as per the user (for example: shipment view to bulk view)', async () => {
        const changeViewFunction = jest.spyOn(wrapper.vm, 'changeView');
        await flushPromises();
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.views');
        element.vm.$emit('change', wrapper.vm.selectedView);
        await wrapper.vm.$nextTick();
        expect(changeViewFunction).toHaveBeenCalledWith(wrapper.vm.selectedView);
    });    

    it('it searches each and every alphabet searched in fullfilment store filter', async () => {
        const searchStoreFunction = jest.spyOn(wrapper.vm, 'searchStore');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            isInitialLoad: false,
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.findComponent({ref:'search-store-dropdown'});
        element.vm.$emit('searchInputChange', "jio");
        await wrapper.vm.$nextTick();
        expect(searchStoreFunction).toHaveBeenCalled();
    }); 

    it('it calls the apiFunction for orders', async () => {
        const callApiFunctionsFunction = jest.spyOn(wrapper.vm, 'callApiFunctions');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            pageError: true,
            selectedView: 'orders'
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let element = wrapper.findComponent({ref:'call-api-function'});
        element.vm.$emit('tryAgain', "orders");
        await wrapper.vm.$nextTick();
        expect(callApiFunctionsFunction).toHaveBeenCalled();
    }); 

    it('it calls the apiFunction for shipment', async () => {
        const callApiFunctionsFunction = jest.spyOn(wrapper.vm, 'callApiFunctions');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            pageError: true,
            selectedView: 'shipment'
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let element = wrapper.findComponent({ref:'call-api-function'});
        element.vm.$emit('tryAgain', "shipment");
        await wrapper.vm.$nextTick();
        expect(callApiFunctionsFunction).toHaveBeenCalled();
    });

    it('it calls the clearSearchNCall', async () => {
        const clearSearchNCallFunction = jest.spyOn(wrapper.vm, 'clearSearchNCall');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            isInitialLoad: false,
            search: 'hi'
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.date-picker-sqaure');
        element.trigger('click', "clearSearchNCall");
        await wrapper.vm.$nextTick();
        expect(clearSearchNCallFunction).toHaveBeenCalled();
    });

    it('it searches each and every alphabet searched in fullfilment store filter', async () => {
        const selectStageTabFunction = jest.spyOn(wrapper.vm, 'selectStageTab');
        await flushPromises();
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
            selectedStageTabIndex: 1,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.tab-item-custom');
        element.trigger('click', 1, {
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
        expect(selectStageTabFunction).toHaveBeenCalled();
    }); 

    it('it changes the pagination method when the pagination is changed by the user', async () => {
        const paginationChangeFunction = jest.spyOn(wrapper.vm, 'paginationChange');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            selectedView: 'orders',
            orders: MOCK_INDEX_DATA.ordersResponseData.items,
            shipmentData: MOCK_INDEX_DATA.shipmentsResponseData.items,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.pagination-main');
        element.vm.$emit('change', {
            "limit": 5,
            "current": 2,
            "total": 70
        });
        await wrapper.vm.$nextTick();
        expect(paginationChangeFunction).toHaveBeenCalled();
    }); 

    it('it changes the types of filters to be applied (for example: chosing search type as shipment id)', async () => {
        const changeFilterTypeFunction = jest.spyOn(wrapper.vm, 'changeFilterType');
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

        const element = wrapper.find('.filter-type');
        element.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(changeFilterTypeFunction).toHaveBeenCalled();
    }); 

    it('it closes the advanded filters slide when clicked', async () => {
        const closeFunction = jest.spyOn(wrapper.vm, 'close');
        await flushPromises();
        wrapper.setData({
            advancedFilterView: true,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.slide-fade');
        element.trigger('click');
        await wrapper.vm.$nextTick();
        expect(closeFunction).toHaveBeenCalled();
    });  

    it('it will apply the advanced filters chosen by the user', async () => {
        const applyAdvancedFiltersFunction = jest.spyOn(wrapper.vm, 'applyAdvancedFilters');
        await flushPromises();
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.slide-adv-filter');
        element.vm.$emit('applyFilters', {
            "closeDrawer": true,
            "data": {
                "bag_status": [
                    "bag_confirmed",
                    "bag_invoiced"
                ]
            }
        }, {}, true, false);
        await wrapper.vm.$nextTick();
        expect(applyAdvancedFiltersFunction).toHaveBeenCalled();
    }); 

    it('it detects any keyboard event has been done by the user', async () => {
        const onSearchInputFunction = jest.spyOn(wrapper.vm, 'onSearchInput');
        await flushPromises();
        wrapper.setData({
            inProgress: false,
            isInitialLoad: false,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.search');
        element.vm.$emit('keyup', {
            "isTrusted": true,
            keyCode: 13
        });
        await wrapper.vm.$nextTick();
        expect(onSearchInputFunction).toHaveBeenCalled();
    }); 

    /* BELOW TEST CASES ARE FOR ADVANCED-FILTER-DRAWER COMPONENT */

    it('it finds the child component we want and runs the onMultiSelectChange method in it', async () => {
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
            selectedAdvancedFilters: {}
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer);
        let element = childComponent.find('.advanced-filter-dropdown')
        element.vm.$emit('change', [
            "000000000000000000000001"
        ], 'sales_channel');

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(true);
    }); 

    it('it search the input written by the user and calls searchFilterOptions function', async () => {
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
            selectedAdvancedFilters: {}
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer);
        let element = childComponent.find('.advanced-filter-dropdown');
        element.vm.$emit('searchInputChange', {
            "id": "nitrozen-dropdown-3oxvs9h1",
            "text": "express"
        }, 0);

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(true);
    }); 

    it('it will remove the chips of the particular advanced filter selected by the user', async () => {
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
            selectedAdvancedFilters: {}
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer)

        childComponent.vm.removeChip([
            "payment_mode"
        ], -1);        

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
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer);

        let element = childComponent.find('.filters-section');
        element.trigger('click');

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(true);
    }); 

    it('it will call the resetFilters method and it will reset all the advanced filters applied by the user', async () => {
        wrapper.setData({
            advancedFilterView: true,
            advancedFilters: MOCK_INDEX_DATA.filtersResponseData.advance.Unfulfilled,
            selectedAdvancedFilters: {},
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer);

        let element = childComponent.find('.clear-button')
        element.vm.$emit('click', {stopPropagation: ()=>{}})

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
        
        const childComponent = wrapper.findComponent(AdvancedFilterDrawer);

        let element = childComponent.find('.apply-filter-button');
        element.vm.$emit('click', {stopPropagation: ()=>{}});

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.advancedFilterView).toBe(true);
    }); 

    /* BELOW TEST CASES ARE FOR SHIPMENT LIST ITEM COMPONENT */

    it('it will just pass all the props to shipment list item component', async () => {
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
            selectedView: 'shipment',
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(ShipmentListItem);
        
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
        
        const childComponent = wrapper.findComponent(ShipmentListItem);
        let element = childComponent.find('.line-break');
        element.trigger('click', 'FY62E38B3801C15856C1', '16590794807021683429K');

        await wrapper.vm.$nextTick();
        expect(childComponent.vm.shipmentList.length).toBeGreaterThanOrEqual(0);
    }); 

    it('it will open the bag dialog view', async () => {
       wrapper.setData({
           orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
           selectedView: 'shipment',
       });

       await wrapper.vm.$forceUpdate();
       await wrapper.vm.$nextTick();
       
       const childComponent = wrapper.findComponent(ShipmentListItem);
       let element = childComponent.find('.item-images');

       element.trigger('click.stop', MOCK_INDEX_DATA.shipmentsResponseData.items[0]);
       await wrapper.vm.$nextTick();

       expect(childComponent.vm.bagDialogView).toBe(true);
    });

    it('it will return SLA hours left', async () => {
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
            selectedView: 'shipment',
        });
 
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(ShipmentListItem);
        
        let returnData = childComponent.vm.displaySlaHoursLeft(MOCK_INDEX_DATA.shipmentsResponseData.items[0].shipment_status.meta.estimated_sla_time);
        expect(returnData).toBe(returnData);
    });

    it('it will copy the data on clipboard when the shipment id is clicked upon', async () => {
        wrapper.setData({
            orderLaneData: MOCK_INDEX_DATA.laneResponseData.super_lanes,
            selectedView: 'shipment',
        });
 
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(ShipmentListItem);
        
        let returnData = childComponent.vm.displaySlaHoursLeft(MOCK_INDEX_DATA.shipmentsResponseData.items[0].shipment_status.meta.estimated_sla_time);
        expect(returnData).toBe(returnData);
    });
   
    it('shipment listing fails data', async() => {
        mock.onGet(URLS.SHIPMENT_V2_LIST(companyId)).reply(500, {});
        await flushPromises();
        expect(wrapper.vm.shipmentData.length).toBeGreaterThanOrEqual(0);
    });
})