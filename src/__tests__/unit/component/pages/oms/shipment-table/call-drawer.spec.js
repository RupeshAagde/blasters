import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from "flush-promises";
import CallDrawer from '@/pages/oms/shipment-table/call-drawer.vue';
import MOCK_SHIPMENT_DATA from '../fixtures/shipment.json';
import URLS from '@/services/domain.service.js'


const mock = new MockAdapter(axios);
let wrapper, router, localVue;

describe('sms-drawer', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: 'orders/:orderId/details', name: 'company-order-details-v2', component: CallDrawer }
            ]
        });
        router.push(`orders/FY63F47BF30DCB3BFB88/details`);
        wrapper = mount(CallDrawer, {
            localVue,
            router,
            propsData: {
                shipment: MOCK_SHIPMENT_DATA.placed
            }
        });
        await flushPromises()
    })

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Input caller number', async () => {
        let callerInput = wrapper.find('.call-from');
        await callerInput.vm.$emit('input', '9989898989');
        await callerInput.vm.$emit('change');
        expect(wrapper.vm.caller).toBe('9989898989');
    })

});
