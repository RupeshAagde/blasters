'use strict';

/* Package imports */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

/* Component imports */
import ActivityLogs from '@/pages/oms/shipment-info/activity-logs.vue';

/* Mock imports */
import DETAILS_SECTION_DATA from '../fixtures/details-section-data.json';

let wrapper, router, localVue;
describe('ActivityLogs', () => {
    beforeEach(async() => {
        localVue = createLocalVue();

        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: 'orders/v2/:orderId/details', name: 'company-order-details-v2', component: ActivityLogs},
            ]
        });
        router.push(`/company/1/orders/v2`);

        const detailsData = DETAILS_SECTION_DATA;

        wrapper = shallowMount(ActivityLogs, {
            localVue,
            router,
            propsData: { shipment: detailsData }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async() => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
});