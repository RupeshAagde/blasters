'use strict';

/* Package imports */
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import URLS from '@/services/domain.service';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

/* Component imports */
import ShipmentItems from '@/pages/oms/shipment-table/index.vue';
import ShipmentTable from '@/pages/oms/shipment-table/table.vue';
import ShipmentDetails from '@/pages/oms/shipment-details/index.vue';
import ShipmentInfo from '@/pages/oms/shipment-info/index.vue';
import ShipmentHeader from '@/pages/oms/shipment-info/header.vue';
import BagsList from '@/pages/oms/bags-list/index.vue';
import BagsListTable from '@/pages/oms/bags-list/table.vue';

/* Mock imports */
import SHIPMENT_TABLE from '../fixtures/shipment-table.json'

let wrapper, router, localVue;
const mock = new MockAdapter(axios);
const responseData =
{
    "statuses": [
        {
            "shipments": [
                {
                    "status": 200,
                    "final_state": {
                        "bag_confirmed": "ready_for_dp_assignment",
                        "shipment_id": "16727399365521269223"
                    },
                    "identifier": "16727399365521269223"
                }
            ]
        }
    ]
};
describe('ShipmentListItem', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        mock.onPost(URLS.ORDER_SHIPMENTS_STATUS_UPDATE({
            "statuses": [
                {
                    "shipments": [
                        {
                            "identifier": "16727399365521269223",
                            "products": []
                        }
                    ],
                    "status": "bag_confirmed",
                    "exclude_bags_next_state": null
                }
            ],
            "task": false,
            "force_transition": false,
            "lock_after_transition": false,
            "unlock_before_transition": false
        })).reply(200, responseData);

        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders/details', component: ShipmentItems },
            ]
        })
        router.push(`/company/48/orders/details`);

        const data = SHIPMENT_TABLE;

        wrapper = mount(ShipmentItems, {
            localVue,
            router,
            propsData: { data },
            computed: {
                checkReadRole() {
                    return true;
                },
                checkUpdateRole() {
                    return true;
                },
                checkCustomerCareRole() {
                    return true;
                },
                isNew() {
                    return true;
                },
            },
            mocks: {
                $basePath: '/company/48'
            }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async() => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('triggers a click', async () => {
        wrapper.trigger('click');
        await wrapper.vm.$nextTick();
    });

    it('it calls the changeActiveShipment method', async () => {
        const changeActiveShipmentFunction = jest.spyOn(wrapper.vm, 'changeActiveShipment');
        await flushPromises();
        // wrapper.setData({
        //     advancedFilterView: true,
        // });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.container-shipment-table');
        element.vm.$emit('changeShipment');
        await wrapper.vm.$nextTick();
        expect(changeActiveShipmentFunction).toHaveBeenCalled();
    });
    
    it('it calls the changeActiveShipment method', async () => {
        const displayConfirmScreenFunction = jest.spyOn(wrapper.vm, 'displayConfirmScreen');
        await flushPromises();
        // wrapper.setData({
        //     advancedFilterView: true,
        // });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.container-shipment-table');
        element.vm.$emit('displayConfirmScreen', {
            "cancel": false
        });
        await wrapper.vm.$nextTick();
        expect(displayConfirmScreenFunction).toHaveBeenCalled();
    }); 

    it('it calls the updateStatus method with different parameters', async () => {
        const updateStatusFunction = jest.spyOn(wrapper.vm, 'updateStatus');
        await flushPromises();
        // wrapper.setData({
        //     showConfirmScreen: false,
        // });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.container-shipment-table');
        element.vm.$emit('updateStatus', {
            "statuses": [
                {
                    "shipments": {
                        "16591813819481423959K": {
                            "products": [
                                {
                                    "identifier": "5243735E4",
                                    "quantity": 1
                                }
                            ],
                            "reasons": []
                        }
                    },
                    "status": "bag_confirmed",
                    "exclude_bags_next_state": null
                }
            ],
            "task": false,
            "force_transition": true
        });
        await wrapper.vm.$nextTick();
        expect(updateStatusFunction).toHaveBeenCalled();
    });

    it('it calls the updateStatus method with different parameters', async () => {
        mock.onPost(URLS.ORDER_SHIPMENTS_STATUS_UPDATE({})).reply(500, {});
        const updateStatusFunction = jest.spyOn(wrapper.vm, 'updateStatus');
        await flushPromises();
        // wrapper.setData({
        //     showConfirmScreen: false,
        // });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.container-shipment-table');
        element.vm.$emit('updateStatus', {
            "statuses": [
                {
                    "shipments": {
                        "16591813819481423959K": {
                            "products": [
                                {
                                    "identifier": "5243735E4",
                                    "quantity": 1
                                }
                            ],
                            "reasons": []
                        }
                    },
                    "status": "bag_confirmed",
                    "exclude_bags_next_state": null
                }
            ],
            "task": false,
            "force_transition": true
        });
        await wrapper.vm.$nextTick();
        expect(updateStatusFunction).toHaveBeenCalled();
    });

    it('it calls the updateStatus method with different parameters', async () => {
        mock.onPost(URLS.ORDER_SHIPMENTS_STATUS_UPDATE({
            "statuses": [
                {
                    "shipments": [
                        {
                            "identifier": "16727399365521269223",
                            "products": []
                        }
                    ],
                    "status": "bag_confirmed",
                    "exclude_bags_next_state": null
                }
            ],
            "task": false,
            "force_transition": false,
            "lock_after_transition": false,
            "unlock_before_transition": false
        })).reply(200, {
            "status": false,
            "message": []
        });

        const updateStatusFunction = jest.spyOn(wrapper.vm, 'updateStatus');
        await flushPromises();
        // wrapper.setData({
        //     showConfirmScreen: false,
        // });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.container-shipment-table');
        element.vm.$emit('updateStatus', {
            "statuses": [
                {
                    "shipments": {
                        "16591813819481423959K": {
                            "products": [
                                {
                                    "identifier": "5243735E4",
                                    "quantity": 1
                                }
                            ],
                            "reasons": []
                        }
                    },
                    "status": "bag_confirmed",
                    "exclude_bags_next_state": null
                }
            ],
            "task": false,
            "force_transition": true
        });
        await wrapper.vm.$nextTick();
        expect(updateStatusFunction).toHaveBeenCalled();
    });

    it('it calls the updateStatus method wiht different parameters', async () => {
        const updateStatusFunction = jest.spyOn(wrapper.vm, 'updateStatus');
        await flushPromises();
        wrapper.setData({
            showConfirmScreen: true,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.container-shipment-table');
        element.vm.$emit('updateStatus', {
            "statuses": [
                {
                    "shipments": {
                        "16591813819481423959K": {
                            "products": [
                                {
                                    "identifier": "5243735E4",
                                    "quantity": 1
                                }
                            ],
                            "reasons": []
                        }
                    },
                    "status": "bag_confirmed",
                    "exclude_bags_next_state": null
                }
            ],
            "task": false,
            "force_transition": true
        });
        await wrapper.vm.$nextTick();
        expect(updateStatusFunction).toHaveBeenCalled();
    });

    it('it calls the close method', async () => {
        const closeFunction = jest.spyOn(wrapper.vm, 'close');
        await flushPromises();
        wrapper.setData({
            showConfirmScreen: true,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.container-in');
        element.vm.$emit('close');
        await wrapper.vm.$nextTick();
        expect(closeFunction).toHaveBeenCalled();
    }); 

    // BELOW TEST CASES ARE FOR THE CHILD COMPONENT .... THAT IS FOR TABLE.VUE (SHIPMENT-TABLE) FOLDER

    it('it will call the onRowClick method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable);

        const onRowClickFunction = jest.spyOn(childComponent.vm, 'onRowClick');
        await flushPromises();

        let element = childComponent.find('.line-break');
        element.trigger('click', '16593491868551604381K');
        await wrapper.vm.$nextTick();

        expect(onRowClickFunction).toHaveBeenCalled();
    });
    
    it('it will call the copyShipmentId method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable);

        const copyShipmentIdFunction = jest.spyOn(childComponent.vm, 'copyShipmentId');
        await flushPromises();

        let element = childComponent.find('.shipment-id');
        element.trigger('click', '16593491868551604381K');
        await wrapper.vm.$nextTick();

        expect(copyShipmentIdFunction).toHaveBeenCalled();
    }); 

    it('it will call the onRejectMethod', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable);

        const onRejectChangeFunction = jest.spyOn(childComponent.vm, 'onRejectChange');
        await flushPromises();

        let element = childComponent.find('.cell-details');
        element.vm.$emit('reject');
        await wrapper.vm.$nextTick();

        expect(childComponent.vm.items.length).toBeGreaterThan(0);
    }); 

    // TEST CASE FOR GREAT GRAND CHILD SHIPMENT-INFO (INDEX.VUE)

    it('it will call the onRowClick method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable);
        const grandChildComponent = childComponent.findComponent(ShipmentDetails);
        const greatGrandChildComponent = grandChildComponent.findComponent(ShipmentInfo);
        let element = greatGrandChildComponent.find('.delivery-details');
        await wrapper.vm.$nextTick();

        expect(childComponent.vm.items.length).toBeGreaterThan(0);
    }); 

    // TEST CASE FOR GREAT GREAT GRAND CHILD SHIPMENT-INFO (HEADER.VUE)

    it('it will call the showShipmentActivity method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable);
        const grandChildComponent = childComponent.findComponent(ShipmentDetails);
        const greatGrandChildComponent = grandChildComponent.findComponent(ShipmentInfo);
        const greatGreatGrandChildComponent = greatGrandChildComponent.findComponent(ShipmentHeader);

        const showShipmentActivityFunction = jest.spyOn(greatGreatGrandChildComponent.vm, 'showShipmentActivity');
        await flushPromises();

        let element = greatGreatGrandChildComponent.find('.log-activity');
        element.trigger('click');
        await wrapper.vm.$nextTick();

        expect(greatGreatGrandChildComponent.vm.quickActivityView).toBeTruthly;
    });      

    // THIS TEST CASE IS FOR BAGS LIST (INDEX.VUE)

    it('it will call the tableColumns computed property', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable);
        const grandChildComponent = childComponent.findComponent(ShipmentDetails);
        const greatGrandChildComponent = grandChildComponent.findComponent(BagsList);

        greatGrandChildComponent.tableColumns;
        await wrapper.vm.$nextTick();

        expect(greatGrandChildComponent.vm.bags.length).toBeGreaterThan(0);
    });

    // THIS TEST CASE IS FOR BAGS LIST (TABLE.VUE)

    it('it will call the increment method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable);
        const grandChildComponent = childComponent.findComponent(ShipmentDetails);
        const greatGrandChildComponent = grandChildComponent.findComponent(BagsList);
        const ggGrandChildComponent = greatGrandChildComponent.findComponent(BagsListTable);
        ggGrandChildComponent.vm.increment(413075, 0);

        expect(ggGrandChildComponent.vm.items.length).toBeGreaterThan(0);
    });

    it('it will call the decrement method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable);
        const grandChildComponent = childComponent.findComponent(ShipmentDetails);
        const greatGrandChildComponent = grandChildComponent.findComponent(BagsList);
        const ggGrandChildComponent = greatGrandChildComponent.findComponent(BagsListTable);

        ggGrandChildComponent.vm.decrement(413075, 0);

        expect(ggGrandChildComponent.vm.items.length).toBeGreaterThan(0);
    });

    it('it will call the onChange method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable);
        const grandChildComponent = childComponent.findComponent(ShipmentDetails);
        const greatGrandChildComponent = grandChildComponent.findComponent(BagsList);
        const ggGrandChildComponent = greatGrandChildComponent.findComponent(BagsListTable);
        
        ggGrandChildComponent.vm.onChange(413075, 0);
        expect(ggGrandChildComponent.vm.items.length).toBeGreaterThan(0);
    });
});
