'use strict';

/* Package imports */
import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';

/* Component imports */
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';

let localVue, wrapper, router;

describe('Side Drawer', () => {
    beforeEach(() => {
        /* Set up local environment for Vue */
        localVue = createLocalVue();
        localVue.use(VueRouter);

        /* Set up the vue router */
        router = new VueRouter({
            routes: [
                {
                    path: `/company/:companyID/orders/bulk`,
                    component: SideDrawer,
                },
            ],
        });
    

        /* Mount the component */
        wrapper = mount(SideDrawer, {
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

    it('close the side drawer on click on close button', async() => {
        const cancelButton = wrapper.find('.cancel-btn');
        cancelButton.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted()['close']).toBeTruthy();
    });

    it('close the side drawer on click on close icon', async() => {
        const cancelButton = wrapper.find('.side-drawer');
        cancelButton.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted()['close']).toBeTruthy();
    });
});
