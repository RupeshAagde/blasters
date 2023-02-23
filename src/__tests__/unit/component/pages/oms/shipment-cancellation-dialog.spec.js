'use strict';

/* Package imports */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import ShipmentCancellationDialog from '@/pages/oms/shipment-cancellation-dialog.vue';

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
});