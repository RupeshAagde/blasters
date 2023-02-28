/* Package import */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from "flush-promises";

/* Component import */
import ChangeBagStateDrawer from '@/pages/oms/shipment-table/change-bag-state-drawer.vue';
/* Mock import */
import SHIPMENT from '../fixtures/shipment.json';
import MOCK_TRANSITION from '../fixtures/transitions.json';
import MOCK_REASONS from '../fixtures/state-reasons.json';
/* Service import */
import URLS from '@/services/domain.service.js'

const mock = new MockAdapter(axios);
let wrapper, router, localVue;

describe('change-bag-state-drawer', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset()
        mock.onGet(URLS.GET_STATES_FOR_TRANSITION()).reply(200, MOCK_TRANSITION.response);
        mock.onGet(URLS.FETCH_REASSIGN_STORE_REASONS(SHIPMENT.placed.shipment_id, SHIPMENT.placed.bags[0].bag_id)).reply(200, MOCK_REASONS.response);
        router = new VueRouter({
            routes: [
                { path: 'orders/:orderId/details', name: 'company-order-details-v2', component: ChangeBagStateDrawer }
            ]
        })
        router.push(`orders/FY63F47BF30DCB3BFB88/details`)
        wrapper = mount(ChangeBagStateDrawer, {
            localVue,
            router,
            propsData: {
                shipment: SHIPMENT.placed
            }
        });
        await flushPromises();
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('should change selected bag state', async() => {
        let bagStateDropdown = wrapper.findComponent({ name: 'nitrozen-dropdown'})
        bagStateDropdown.vm.$emit('input', 'bag_confirmed')
        bagStateDropdown.vm.$emit('change')
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedState).toBe('bag_confirmed');
    });

    it('should render reason dropdown', async() => {
        let bagStateDropdown = wrapper.findComponent({ name: 'nitrozen-dropdown'})
        bagStateDropdown.vm.$emit('input', 'cancelled_customer')
        bagStateDropdown.vm.$emit('change')
        await flushPromises();
        await wrapper.vm.$nextTick();
        // checking second dropdown in dom
        let reasonDropdown = wrapper.findAllComponents({name: 'nitrozen-dropdown'}).at(1);
        expect(reasonDropdown.exists()).toBeTruthy();
        reasonDropdown.vm.$emit('input', wrapper.vm.reasons[0].value)
        reasonDropdown.vm.$emit('change')
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedReason).toBe(wrapper.vm.reasons[0].value);
    });

});

describe('change-bag-state-drawer unable to fetch', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset()
        mock.onGet(URLS.GET_STATES_FOR_TRANSITION()).reply(400, {});
        mock.onGet(URLS.FETCH_REASSIGN_STORE_REASONS(SHIPMENT.placed.shipment_id, SHIPMENT.placed.bags[0].bag_id)).reply(400, {});
        router = new VueRouter({
            routes: [
                { path: 'orders/:orderId/details', name: 'company-order-details-v2', component: ChangeBagStateDrawer }
            ]
        })
        router.push(`orders/FY63F47BF30DCB3BFB88/details`)
        wrapper = mount(ChangeBagStateDrawer, {
            localVue,
            router,
            propsData: {
                shipment: SHIPMENT.placed
            }
        });
        await flushPromises();
    });
    it('bag states should be empty', () => {
        expect(wrapper.vm.bagStates).toStrictEqual([]);
    });
});

describe('change-bag-state-drawer no reason/store', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset()
        mock.onGet(URLS.GET_STATES_FOR_TRANSITION()).reply(200, { fynd: [] });
        mock.onGet(URLS.FETCH_REASSIGN_STORE_REASONS(SHIPMENT.placed.shipment_id, SHIPMENT.placed.bags[0].bag_id)).reply(200, {reasons:[]});
        router = new VueRouter({
            routes: [
                { path: 'orders/:orderId/details', name: 'company-order-details-v2', component: ChangeBagStateDrawer }
            ]
        })
        router.push(`orders/FY63F47BF30DCB3BFB88/details`)
        wrapper = mount(ChangeBagStateDrawer, {
            localVue,
            router,
            propsData: {
                shipment: SHIPMENT.placed
            }
        });
        await flushPromises();
    });
    it('reasons should be empty', () => {
        expect(wrapper.vm.reasons).toStrictEqual([]);
    });
});