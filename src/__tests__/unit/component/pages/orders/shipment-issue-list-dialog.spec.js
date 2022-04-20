'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import ShipmentIssueListDialog from '@/pages/orders/shipment-issue-list-dialog.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import TICKET_LIST from './fixtures/ticket-list.json';
import VueRouter from 'vue-router';

let wrapper, router, localVue
describe('ShipmentIssueListDialog', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: ShipmentIssueListDialog }
            ]
        })
        router.push(`/orders/list/`);
        const issues = TICKET_LIST.items;
        const shipment_id = ORDER_LIST_DATA.items[0].shipments[0].id;
        const isDrawerView = false
        wrapper = shallowMount(ShipmentIssueListDialog, {
            localVue,
            router,
            propsData: { issues, shipment_id, isDrawerView},
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