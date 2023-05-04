'use strict';

/* Package imports */
import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';

/* Component imports */
import BulkAlertBox from '@/pages/oms/bulk-actions/alert-box.vue';

let localVue, wrapper, router;

describe('Bulk alert box', () => {
    beforeEach(() => {
        /* Set up local environment for Vue */
        localVue = createLocalVue();
        localVue.use(VueRouter);

        /* Set up the vue router */
        router = new VueRouter({
            routes: [
                {
                    path: `/company/:companyID/orders/bulk`,
                    component: BulkAlertBox,
                },
            ],
        });
    

        /* Mount the component */
        wrapper = mount(BulkAlertBox, {
            localVue,
            router,
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('is a Vue instance', () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
});
