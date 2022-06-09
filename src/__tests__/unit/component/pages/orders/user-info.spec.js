'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import UserInfo from '@/pages/orders/user-info.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import VueRouter from 'vue-router';
import ACCESS_MOCK_DATA from './fixtures/access-data.json';

let wrapper, router, localVue
describe('Fullfilment Store', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: UserInfo }
            ]
        })
        router.push(`/orders/list/`);
        const user = ORDER_LIST_DATA.items[0].user;
        wrapper = shallowMount(UserInfo, {
            localVue,
            router,
            propsData: { user },
            computed: {
                accessDetail: () => ACCESS_MOCK_DATA,
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
});