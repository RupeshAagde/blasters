'use strict';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import ViewPrescriptionDialog from '@/pages/orders/view-prescription-dialog.vue';
import VueRouter from 'vue-router';

let wrapper, router, localVue
describe('View Prescription Dialog', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: ViewPrescriptionDialog }
            ]
        })
        router.push(`/orders/list/`);
        wrapper = shallowMount(ViewPrescriptionDialog, {
            localVue,
            router 
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
});
