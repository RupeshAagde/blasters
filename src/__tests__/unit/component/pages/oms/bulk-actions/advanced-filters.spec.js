'use strict';

/* Package imports */
import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import { cloneDeep } from 'lodash';

/* Component imports */
import BulkAdvancedFilters from '@/pages/oms/bulk-actions/advanced-filters.vue';

/* Mock inmports */
import BULK_ACTION_DATA from '@/__tests__/unit/component/pages/oms/fixtures/bulk-actions-data.json';

let localVue, wrapper, router;

describe('Bulk Advanced Filter Drawer', () => {
    beforeEach(() => {
        /* Set up local environment for Vue */
        localVue = createLocalVue();
        localVue.use(VueRouter);

        /* Set up the vue router */
        router = new VueRouter({
            routes: [
                {
                    path: `/company/:companyID/orders/bulk`,
                    component: BulkAdvancedFilters,
                },
            ],
        });
        router.push(`/company/1/orders/bulk`);

        /* Mount the component */
        wrapper = mount(BulkAdvancedFilters, {
            localVue,
            router,
            data() {
                return {
                    // advancedFilters: cloneDeep(BULK_ACTION_DATA),
                    // alertMsg: '',
                };
            },
            propsData: { advancedFilters: cloneDeep(BULK_ACTION_DATA.advance), advancedSelectedFilters: {}},
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
});
