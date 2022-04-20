'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import OrderingStore from '@/pages/orders/ordering-store.vue';
import VueRouter from 'vue-router';

let wrapper, router, localVue;

describe('Ordering Store', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: OrderingStore }
            ]
        })
        router.push(`/orders/list/`);

        wrapper = shallowMount(OrderingStore, {
            localVue,
            router,
            propsData: {
                address: {
                    id: '0001',
                    code: 'ABC',
                    name: 'Some order',
                    contact_person: 'ABC',
                    phone: '123456789'
                }
            }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
})