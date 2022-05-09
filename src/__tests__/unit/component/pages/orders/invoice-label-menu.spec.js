'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import InvoiceLabelMenu from '@/pages/orders/invoice-label-menu.vue';
import SAMPLE_SHIPMENT from './fixtures/sample-shipment.json';
// import SHIPMENT_WITH_AWB from './fixtures/shipment-awb.json';

let wrapper, router, localVue;
describe('InvoiceLabelMenu', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: InvoiceLabelMenu }
            ]
        })
        router.push(`/orders/list/`);

        wrapper = shallowMount(InvoiceLabelMenu, {
            localVue,
            router,
            propsData: {
                toggleMenu: 'invoice',
                shipment: SAMPLE_SHIPMENT
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

    it('should throw an error saying no AWB no if AWB no is not present', async() => {
        let showInfoMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showInfo');

        let a4element = wrapper.find('.preview-a4');
        a4element.trigger('click');

        expect(showInfoMethod).toHaveBeenCalledWith("AWB no is not generated for this shipment yet");

        let a6element = wrapper.find('.preview-a6');
        a6element.trigger('click');

        expect(showInfoMethod).toHaveBeenCalledWith("AWB no is not generated for this shipment yet");

        let poselement = wrapper.find('.preview-pos');
        poselement.trigger('click');

        expect(showInfoMethod).toHaveBeenCalledWith("AWB no is not generated for this shipment yet");
    });
});
