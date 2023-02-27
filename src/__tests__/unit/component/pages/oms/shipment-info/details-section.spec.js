'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';

/* Component imports */
import DetailsSection from '@/pages/oms/shipment-info/details-section.vue';

/* Mock imports */
import DETAILS_SECTION from '../fixtures/details-section.json';
import COMPUTED_DATA from '../fixtures/computed_data.json';

let wrapper, router, localVue;
describe('DetailsSection', () => {
    beforeEach(async() => {
        localVue = createLocalVue();

        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders/:orderId/details', name: 'company-order-details-v2', component: DetailsSection},
            ]
        });
        router.push(`/company/1/orders/v2`);

        const detailsData = DETAILS_SECTION;

        wrapper = mount(DetailsSection, {
            localVue,
            router,
            propsData: { shipment: detailsData },
            computed: {
                accessDetail: () => COMPUTED_DATA.accessDetail,
                orderRoles:() => COMPUTED_DATA.orderRoles
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

    it('it opens the pickup slot drawer when clicked when the user is on the second tab', async () => {
        wrapper.setData({
            selectedStageTabIndex: 2,
            isPickupSlot: false
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.findComponent({ref:'pickup-slot-drawer'});
        element.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isPickupSlot).toBe(false);
    }); 

    it('switches between tabs)', async () => {
        await flushPromises();
        wrapper.setData({
            selectedStageTabIndex: 0,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find(".style-font");
        element.vm.$emit('tab-change', {
            "index": 1,
            "item": "Invoice Details"
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedStageTabIndex).toBe(1);
    }); 

    it('it switched between tabs when clicked on the same tab', async () => {
        await flushPromises();
        wrapper.setData({
            selectedStageTabIndex: 1,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find(".style-font");
        element.vm.$emit('tab-change', {
            "index": 1,
            "item": "Invoice Details"
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedStageTabIndex).toBe(1);
    }); 

    it('it closes the pickup slot drawer when close is clicked', async () => {
        wrapper.setData({
            isPickupSlot: true
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.findComponent({ref:'close-details'});
        element.vm.$emit('close');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isPickupSlot).toBe(false);
    }); 
});