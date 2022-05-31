'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import ShipmentActions from '@/pages/orders/shipment-actions.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import VueRouter from 'vue-router';
import ACCESS_MOCK_DATA from './fixtures/access-data.json';

let wrapper, router, localVue;
describe('Shipment Actions', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list', component: ShipmentActions }
            ]
        })
        router.push(`/orders/list`);
        const shipments = ORDER_LIST_DATA.items[0].shipments;
        const shipmentBagCount = {
            bag: 1,
            shipment: 1
        };
        wrapper = shallowMount(ShipmentActions, {
            localVue,
            router,
            propsData: { shipments, shipmentBagCount },
            computed: {
                accessDetail: () => ACCESS_MOCK_DATA,
            }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });

    it('selectAllShipments', async() => {
        wrapper.vm.selectAllShipments()
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().selectAllShipments).toBeTruthy()
    });

    it('unselectAllShipments', async() => {
        wrapper.vm.unselectAllShipments()
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().unselectAllShipments).toBeTruthy()
    });
    
    it('updateMultipleShipment', async() => {
        wrapper.vm.updateMultipleShipment()
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().updateMultipleShipment).toBeTruthy()
    });
});