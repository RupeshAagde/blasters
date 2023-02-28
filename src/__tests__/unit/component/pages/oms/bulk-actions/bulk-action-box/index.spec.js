'use strict';

/* Package imports */
import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';

/* Component imports */
import BulkActionBox from '@/pages/oms/bulk-actions/bulk-action-box/index.vue';

let localVue, wrapper, router;

describe('Bulk action box', () => {
    beforeEach(() => {
        /* Set up local environment for Vue */
        localVue = createLocalVue();
        localVue.use(VueRouter);

        /* Set up the vue router */
        router = new VueRouter({
            routes: [
                {
                    path: `/company/:companyID/orders/bulk`,
                    component: BulkActionBox,
                },
            ],
        });

        /* Mount the component */
        wrapper = mount(BulkActionBox, {
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
