/* Package import */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from "flush-promises";

/* Component import */
import OrderConfirmPopup from '@/pages/oms/shipment-table/order-confirm-popup.vue';

let wrapper, router, localVue;

describe('Order Confirm Popup Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: 'orders/:orderId/details', name: 'company-order-details-v2', component: OrderConfirmPopup }
            ]
        });
        router.push(`orders/FY63F47BF30DCB3BFB88/details`);
        wrapper = mount(OrderConfirmPopup, {
            localVue,
            router
        });
        await flushPromises();
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('click confirm button', async() => {
        let confirmBtn = wrapper.find('.button-submit');
        confirmBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
    });
});