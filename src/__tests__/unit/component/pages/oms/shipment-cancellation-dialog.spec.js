'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import ShipmentCancellationDialog from '@/pages/oms/shipment-cancellation-dialog.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// import SHIPMENT_LIST_DATA from './fixtures/shipment-list.json';
// import flushPromises from "flush-promises";
const mock = new MockAdapter(axios);
let wrapper, router, localVue
describe('ShipmentDpTracking', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders/', component: ShipmentCancellationDialog }
            ]
        })
        router.push(`/company/1/orders`);
        
        const title = "Cancellation reason for unselected bags"
        wrapper = shallowMount(ShipmentCancellationDialog, {
            localVue,
            router,
            propsData: { title },
            // data() {
            //     return {
            //         // cancellationReasons: [],
            //         cancellingShipments: SHIPMENT_LIST_DATA,
            //         // cancelDescription: this.getInitialValue('')
            //     };
            // },
        });
    })
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('ShipmentDpTracking renders', async() => {
        const div = wrapper.find('template')
        expect(div.exists()).toBe(true)
    });

    // it('it calls the copyReason method', async () => {
    //     // const clickEvent = jest.spyOn(wrapper.vm, 'copyReason');
    //     // // await flushPromises();
    //     wrapper.setData({
    //         cancellingShipments: SHIPMENT_LIST_DATA,
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     wrapper.vm.copyReason()
    //     // const copyClick = wrapper.find('.copy-reason');
    //     // console.log(copyClick)
    //     // copyClick.vm.$emit('click');
    //     // await wrapper.vm.$nextTick();
    //     // expect(clickEvent).toHaveBeenCalled();
    // });

});