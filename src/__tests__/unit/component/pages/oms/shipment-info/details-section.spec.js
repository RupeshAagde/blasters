'use strict';

/* Package imports */
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';

/* Component imports */
import DetailsSection from '@/pages/oms/shipment-info/details-section.vue'

/* Mock imports */
import DETAILS_SECTION from '../fixtures/details-section.json'
import COMPUTED_DATA from '../fixtures/computed_data.json'

let wrapper, router, localVue;
describe('DetailsSection', () => {
    beforeEach(async() => {
        localVue = createLocalVue();

        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders/:orderId/details', name: 'company-order-details-v2', component: DetailsSection},
            ]
        })
        router.push(`/company/1/orders/v2`);

        const detailsData = DETAILS_SECTION

        wrapper = mount(DetailsSection, {
            localVue,
            router,
            propsData: { shipment: detailsData },
            // data() {
            //     query = wrapper.vm.$route.query
            // },
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

    // it('it opens the Select Delivery  Partner drawer when clicked)', async () => {
    //     wrapper.setData({
    //         selectedStageTabIndex: 2,
    //         isDeliveryPartner: false
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const copyClick = wrapper.findComponent({ref:'packaging-icon'});
    //     copyClick.trigger('click');
    //     await wrapper.vm.$nextTick();
    //     expect(wrapper.vm.isDeliveryPartner).toBe(true);
    // });   

    // it('it opens the Packaging Dimensions drawer when clicked)', async () => {
    //     wrapper.setData({
    //         selectedStageTabIndex: 2,
    //         isPackagingDimension: false,
    //         isSelectDp: false
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const copyClick = wrapper.findComponent({ref:'packaging-dimensions'});
    //     copyClick.trigger('click');
    //     await wrapper.vm.$nextTick();
    //     expect(wrapper.vm.openPackagingDimensions).toBe(false);
    // }); 

    it('it opens the Pickup Slot drawer when clicked)', async () => {
        wrapper.setData({
            selectedStageTabIndex: 2,
            isPickupSlot: false
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.findComponent({ref:'pickup-slot-drawer'});
        copyClick.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isPickupSlot).toBe(false);
    }); 

    it('it switched between tabs)', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'changeLaneType');
        await flushPromises();
        wrapper.setData({
            selectedStageTabIndex: 0,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find(".style-font");
        copyClick.vm.$emit('tab-change', {
            "index": 1,
            "item": "Invoice Details"
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedStageTabIndex).toBe(1);
    }); 

    it('it switched between tabs when clicked on the same tab)', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'changeLaneType');
        await flushPromises();
        wrapper.setData({
            selectedStageTabIndex: 1,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find(".style-font");
        copyClick.vm.$emit('tab-change', {
            "index": 1,
            "item": "Invoice Details"
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedStageTabIndex).toBe(1);
    }); 

    it('it opens the Pickup Slot drawer when clicked)', async () => {
        wrapper.setData({
            isPickupSlot: true
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.findComponent({ref:'close-details'});
        copyClick.vm.$emit('close');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isPickupSlot).toBe(false);
    }); 

});