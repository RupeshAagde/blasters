/* Package import */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from "flush-promises";

/* Component import */
import BankDetailsDrawer from '@/pages/oms/shipment-table/bank-details-drawer.vue';


let wrapper, router, localVue;

describe('sms-drawer', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: 'orders/:orderId/details', name: 'company-order-details-v2', component: BankDetailsDrawer }
            ]
        });
        router.push(`orders/FY63F47BF30DCB3BFB88/details`);
        wrapper = mount(BankDetailsDrawer, {
            localVue,
            router
        });
        await flushPromises();
    })

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('input count test', async() => {
        let inputs = wrapper.findAll('.search-input');
        expect(inputs).toHaveLength(6);
    })
});