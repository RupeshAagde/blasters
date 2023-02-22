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
// import ShipmentIssueListDialog from '@/pages/admin/oms/shipment-issue-list-dialog.vue';

import Actions from '@/pages/oms/shipment-table/actions.vue'
import GET_EMPLOYEE_ACCESS_DETAIL from '../fixtures/employee-access-detail.json';
import GET_USER_INFO from '../fixtures/user-info-details.json'
import ADMIN_GET_SELLER_SUPPORT_CONFIG from '../fixtures/seller-support-config.json'

/* Mock imports */
import SHIPMENT_TABLE from '../fixtures/shipment-table.json'
import { wrap } from 'lodash';

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
        // localVue.use(VueRouter);
        // mock.reset();
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
            // data() {
            //     // query = wrapper.vm.$route.query
            //     // status = 'placed'
            // },
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
        const clickEvent = jest.spyOn(wrapper.vm, 'changeActiveShipment');
        await flushPromises();
        // wrapper.setData({
        //     advancedFilterView: true,
        // });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.container-shipment-table');
        copyClick.vm.$emit('changeShipment');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });
    
    it('it calls the changeActiveShipment method', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'displayConfirmScreen');
        await flushPromises();
        // wrapper.setData({
        //     advancedFilterView: true,
        // });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.container-shipment-table');
        copyClick.vm.$emit('displayConfirmScreen', {
            "cancel": false
        });
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    }); 

    it('it calls the updateStatus method', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'updateStatus');
        await flushPromises();
        // wrapper.setData({
        //     showConfirmScreen: false,
        // });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.container-shipment-table');
        copyClick.vm.$emit('updateStatus', {
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
        expect(clickEvent).toHaveBeenCalled();
    });

    it('it calls the updateStatus method', async () => {
        mock.onPost(URLS.ORDER_SHIPMENTS_STATUS_UPDATE({})).reply(500, {});
        const clickEvent = jest.spyOn(wrapper.vm, 'updateStatus');
        await flushPromises();
        // wrapper.setData({
        //     showConfirmScreen: false,
        // });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.container-shipment-table');
        copyClick.vm.$emit('updateStatus', {
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
        expect(clickEvent).toHaveBeenCalled();
    });

    it('it calls the updateStatus method', async () => {
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

        const clickEvent = jest.spyOn(wrapper.vm, 'updateStatus');
        await flushPromises();
        // wrapper.setData({
        //     showConfirmScreen: false,
        // });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.container-shipment-table');
        copyClick.vm.$emit('updateStatus', {
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
        expect(clickEvent).toHaveBeenCalled();
    });

    it('it calls the updateStatus method', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'updateStatus');
        await flushPromises();
        wrapper.setData({
            showConfirmScreen: true,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.container-shipment-table');
        copyClick.vm.$emit('updateStatus', {
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
        expect(clickEvent).toHaveBeenCalled();
    });

    it('it calls the close method', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'close');
        await flushPromises();
        wrapper.setData({
            showConfirmScreen: true,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.container-in');
        copyClick.vm.$emit('close');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    }); 

    // BELOW TEST CASES ARE FOR THE CHILD COMPONENT .... THAT IS FOR TABLE.VUE (SHIPMENT-TABLE) FOLDER

    it('it will call the onRowClick method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable)

        const clickEvent = jest.spyOn(childComponent.vm, 'onRowClick');
        await flushPromises();

        let a = childComponent.find('.line-break')
        a.trigger('click', '16593491868551604381K')
        await wrapper.vm.$nextTick();

        expect(clickEvent).toHaveBeenCalled();
    });
    
    it('it will call the copyShipmentId method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable)

        const clickEvent = jest.spyOn(childComponent.vm, 'copyShipmentId');
        await flushPromises();

        let a = childComponent.find('.shipment-id')
        a.trigger('click', '16593491868551604381K')
        await wrapper.vm.$nextTick();

        expect(clickEvent).toHaveBeenCalled();
    }); 

    // it('it will call the onRowClick method', async () => {
    //     const childComponent = wrapper.findComponent(ShipmentTable)

    //     // childComponent.setProps({
    //     //     shipmentProcessing: false
    //     // })

    //     const clickEvent = jest.spyOn(childComponent.vm, 'onStatusUpdate');
    //     await flushPromises();

    //     let a = childComponent.find('.actions-shipment')
    //     a.vm.$emit('updateStatus', 'dp_assigned', undefined)
    //     await wrapper.vm.$nextTick();

    //     expect(childComponent.vm.items.length).toBeGreaterThan(0);
    // }); 

    // it('it will call the onRowClick method', async () => {
    //     const childComponent = wrapper.findComponent(ShipmentTable)

    //     // childComponent.setProps({
    //     //     shipmentProcessing: false
    //     // })

    //     const clickEvent = jest.spyOn(childComponent.vm, 'onStatusUpdate');
    //     await flushPromises();

    //     let a = childComponent.find('.actions-shipment')
    //     a.vm.$emit('updateStatus', 'bag_confirmed', undefined)
    //     await wrapper.vm.$nextTick();

    //     expect(childComponent.vm.items.length).toBeGreaterThan(0);
    // }); 

    // it('it will call the onRowClick method', async () => {
    //     const childComponent = wrapper.findComponent(ShipmentTable)

    //     // childComponent.setProps({
    //     //     shipmentProcessing: false
    //     // })

    //     const clickEvent = jest.spyOn(childComponent.vm, 'onStatusUpdate');
    //     await flushPromises();

    //     let a = childComponent.find('.actions-shipment')
    //     a.vm.$emit('updateStatus', 'cancel_order', undefined)
    //     await wrapper.vm.$nextTick();

    //     expect(childComponent.vm.items.length).toBeGreaterThan(0);
    // }); 

    // it('it will call the onRowClick method', async () => {
    //     const childComponent = wrapper.findComponent(ShipmentTable)

    //     // childComponent.setProps({
    //     //     shipmentProcessing: false
    //     // })

    //     const clickEvent = jest.spyOn(childComponent.vm, 'onStatusUpdate');
    //     await flushPromises();

    //     let a = childComponent.find('.actions-shipment')
    //     a.vm.$emit('updateStatus', 'bag_invoiced', undefined)
    //     await wrapper.vm.$nextTick();

    //     expect(childComponent.vm.items.length).toBeGreaterThan(0);
    // }); 


    it('it will call the onRejectMethod', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable)

        const clickEvent = jest.spyOn(childComponent.vm, 'onRejectChange');
        await flushPromises();

        let a = childComponent.find('.cell-details')
        a.vm.$emit('reject')
        await wrapper.vm.$nextTick();

        expect(childComponent.vm.items.length).toBeGreaterThan(0);
    }); 

    // BELOW TEST CASES ARE FOR THE GRAND CHILD COMPO ... THAT IS THE ACTION.VUE (SHIPMENT-TABLE)

    // it('it will call the onRowClick method', async () => {
    //     const childComponent = wrapper.findComponent(ShipmentTable)

    //     const clickEvent = jest.spyOn(childComponent.vm, 'onStatusUpdate');
    //     await flushPromises();

    //     let a = childComponent.find('.action')
    //     a.vm.$emit('updateStatus', 'dp_assigned', undefined)
    //     await wrapper.vm.$nextTick();

    //     const grandChildComponent = childComponent.findComponent(Actions)
        
    //     // const clickEvent1 = jest.spyOn(grandChildComponent.vm, 'onStatusUpdate');
    //     // await flushPromises();

    //     // grandChildComponent.setData({
    //     //     accessDetail: () => GET_EMPLOYEE_ACCESS_DETAIL,
    //     // });

    //     let b = grandChildComponent.find('.container-invoice-action')
    //     console.log(b)
    //     // b.vm.$emit('updateStatus', 'dp_assigned', undefined)
    //     // await wrapper.vm.$nextTick();

    //     // console.log(grandChildComponent.vm.locked)
    //     // console.log(grandChildComponent.vm.ordering_channel)
    //     console.log(grandChildComponent.vm.shipment.shipment_id)
    //     // console.log(grandChildComponent.vm.rejectUpdate)
    //     // expect(childComponent.vm.items.length).toBeGreaterThan(0);
    // }); 

    // it('it will call the onRowClick method', async () => {
    //     const childComponent = wrapper.findComponent(ShipmentTable)

    //     const grandChildComponent = childComponent.findComponent(Actions)
        
    //     const clickEvent1 = jest.spyOn(grandChildComponent.vm, 'onInvoiceChange');
    //     await flushPromises();

    //     grandChildComponent.setData({
    //         accessDetail: GET_EMPLOYEE_ACCESS_DETAIL,
    //         // checkUpdateRole: jest.fn(() => true),
    //     });

    //     wrapper.vm.$forceUpdate();
    //     wrapper.vm.$nextTick();

    //     let b = grandChildComponent.find('.container-invoice-action')
    //     await wrapper.vm.$nextTick();
    //     // b.vm.$emit('change')
    //     // await wrapper.vm.$nextTick();

    
      
    // }); 

    // it('it will call the onRowClick method', async () => {
    //     const childComponent = wrapper.findComponent(ShipmentTable)

    //     const grandChildComponent = childComponent.findComponent(Actions)
        
    //     const clickEvent1 = jest.spyOn(grandChildComponent.vm, 'onInvoiceChange');
    //     await flushPromises();

    //     // grandChildComponent.setData({
            
    //     // });

    //     let b = grandChildComponent.find('.shipment-action-button')
    //     await wrapper.vm.$nextTick();
    //     console.log(b)
    //     // b.vm.$emit('change')
    //     // await wrapper.vm.$nextTick();

    
      
    // }); 

    // TEST CASE FOR GREAT GRAND CHILD SHIPMENT-INFO (INDEX.VUE)

    it('it will call the onRowClick method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable)
        const grandChildComponent = childComponent.findComponent(ShipmentDetails)
        const greatGrandChildComponent = grandChildComponent.findComponent(ShipmentInfo)
        let b = greatGrandChildComponent.find('.delivery-details')
        await wrapper.vm.$nextTick();

        expect(childComponent.vm.items.length).toBeGreaterThan(0);
    }); 

    // TEST CASE FOR GREAT GREAT GRAND CHILD SHIPMENT-INFO (HEADER.VUE)

    it('it will call the showShipmentActivity method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable)
        const grandChildComponent = childComponent.findComponent(ShipmentDetails)
        const greatGrandChildComponent = grandChildComponent.findComponent(ShipmentInfo)
        const greatGreatGrandChildComponent = greatGrandChildComponent.findComponent(ShipmentHeader)

        const clickEvent = jest.spyOn(greatGreatGrandChildComponent.vm, 'showShipmentActivity');
        await flushPromises();

        let b = greatGreatGrandChildComponent.find('.log-activity')
        b.trigger('click')
        await wrapper.vm.$nextTick();

        expect(greatGreatGrandChildComponent.vm.quickActivityView).toBeTruthly;
    });     

    // it('it will call the closeActivityDialog method', async () => {
    //     const childComponent = wrapper.findComponent(ShipmentTable)
    //     const grandChildComponent = childComponent.findComponent(ShipmentDetails)
    //     const greatGrandChildComponent = grandChildComponent.findComponent(ShipmentInfo)
    //     const greatGreatGrandChildComponent = greatGrandChildComponent.findComponent(ShipmentHeader)

    //     greatGreatGrandChildComponent.setData({
    //         quickActivityView: true
    //     });

    //     const clickEvent = jest.spyOn(greatGreatGrandChildComponent.vm, 'closeActivityDialog');
    //     await flushPromises();

    //     let b = greatGreatGrandChildComponent.find('.slide-fade')
    //     b.trigger('click')
    //     await wrapper.vm.$nextTick();

    //     expect(greatGreatGrandChildComponent.vm.quickActivityView).toBeFalsy;
    // });  

    // it('it will call the closeIssueDialog method', async () => {
    //     const childComponent = wrapper.findComponent(ShipmentTable)
    //     const grandChildComponent = childComponent.findComponent(ShipmentDetails)
    //     const greatGrandChildComponent = grandChildComponent.findComponent(ShipmentInfo)
    //     const greatGreatGrandChildComponent = greatGrandChildComponent.findComponent(ShipmentHeader)

    //     greatGreatGrandChildComponent.setData({
    //         quickIssueView: true
    //     });

    //     const clickEvent = jest.spyOn(greatGreatGrandChildComponent.vm, 'closeIssueDialog');
    //     await flushPromises();

    //     let b = greatGreatGrandChildComponent.find('.slide-fade')
    //     b.trigger('click')
    //     await wrapper.vm.$nextTick();

    //     expect(greatGreatGrandChildComponent.vm.quickIssueView).toBeFalsy;
    // });

    // it('it will call the openIssueList method', async () => {
    //     const childComponent = wrapper.findComponent(ShipmentTable)
    //     const grandChildComponent = childComponent.findComponent(ShipmentDetails)
    //     const greatGrandChildComponent = grandChildComponent.findComponent(ShipmentInfo)
    //     const greatGreatGrandChildComponent = greatGrandChildComponent.findComponent(ShipmentHeader)

        
    //     // greatGreatGrandChildComponent.setData({
    //     //     // accessDetail: () => GET_EMPLOYEE_ACCESS_DETAIL,
    //     //     // userinfo: () => GET_USER_INFO,
    //     //     // support_config: () => ADMIN_GET_SELLER_SUPPORT_CONFIG,
    //     //     checkReadRole: jest.fn(() => true),
    //     //     checkUpdateRole: jest.fn(() => true),
    //     //     ticketCreationStatus: jest.fn(() => true),
    //     // });

    //     greatGreatGrandChildComponent.vm.openIssueList()
    //     await wrapper.vm.$nextTick();
    //     // let b = greatGreatGrandChildComponent.find('.report-an-issue')
    //     // console.log(b)
    //     // b.trigger('click')
    //     // await wrapper.vm.$nextTick();

    //     expect(greatGreatGrandChildComponent.vm.quickIssueView).toBeTruthly;
    // });

    // THIS TEST CASE IS FOR BAGS LIST (INDEX.VUE)

    it('it will call the tableColumns computed property', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable)
        const grandChildComponent = childComponent.findComponent(ShipmentDetails)
        const greatGrandChildComponent = grandChildComponent.findComponent(BagsList)
        
        // greatGrandChildComponent.setProps({
        //     status: 'placed'
        // });

        greatGrandChildComponent.tableColumns;
        await wrapper.vm.$nextTick();

        expect(greatGrandChildComponent.vm.bags.length).toBeGreaterThan(0);
    });

    // THIS TEST CASE IS FOR BAGS LIST (TABLE.VUE)

    it('it will call the increment method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable)
        const grandChildComponent = childComponent.findComponent(ShipmentDetails)
        const greatGrandChildComponent = grandChildComponent.findComponent(BagsList)
        const ggGrandChildComponent = greatGrandChildComponent.findComponent(BagsListTable)
        // console.log(ggGrandChildComponent)

        // wrapper.setData({

        // });

        // await wrapper.vm.$forceUpdate();
        // await wrapper.vm.$nextTick();

        // let b = ggGrandChildComponent.find('.qty-reject')
        // console.log(b)
        // b.vm.$emit('increment', 413075, 0)
        ggGrandChildComponent.vm.increment(413075, 0);

        expect(ggGrandChildComponent.vm.items.length).toBeGreaterThan(0);
    });

    it('it will call the decrement method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable)
        const grandChildComponent = childComponent.findComponent(ShipmentDetails)
        const greatGrandChildComponent = grandChildComponent.findComponent(BagsList)
        const ggGrandChildComponent = greatGrandChildComponent.findComponent(BagsListTable)

        // let b = ggGrandChildComponent.find('.qty-reject')
        // b.vm.$emit('decrement', 413075, 0)

        ggGrandChildComponent.vm.decrement(413075, 0);

        expect(ggGrandChildComponent.vm.items.length).toBeGreaterThan(0);
    });

    it('it will call the onChange method', async () => {
        const childComponent = wrapper.findComponent(ShipmentTable)
        const grandChildComponent = childComponent.findComponent(ShipmentDetails)
        const greatGrandChildComponent = grandChildComponent.findComponent(BagsList)
        const ggGrandChildComponent = greatGrandChildComponent.findComponent(BagsListTable)

        // let b = ggGrandChildComponent.find('.qty-reject')
        // b.vm.$emit('change', 413075, 0)
        
        ggGrandChildComponent.vm.onChange(413075, 0);
        expect(ggGrandChildComponent.vm.items.length).toBeGreaterThan(0);
    });

    // // BELOW TEST CASES ARE FOR THE INVOICE-LABEL-MENU

    // it('it will call the onChange method', async () => {
    //     const component = wrapper.findComponent(InvoiceLabelMenu)
    //     console.log(component)

    //     // let b = ggGrandChildComponent.find('.qty-reject')
    //     // b.vm.$emit('change', 50557, 0)

    //     // expect(ggGrandChildComponent.vm.items.length).toBeGreaterThan(0);
    // });

});
