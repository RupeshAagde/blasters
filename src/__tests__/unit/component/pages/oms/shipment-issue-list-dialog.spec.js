'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from "flush-promises";

/* Component imports */
import ShipmentIssueListDialog from '@/pages/oms/shipment-issue-list-dialog.vue';

let wrapper, router, localVue;
const RoleModal = {
    render: () => {},
    methods: {
        open: () => { },
        close: () => { }
    }
};

describe('ShipmentDpTracking', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders/',name: 'company-support-view', component: ShipmentIssueListDialog },
                { path: 'support/ticket/create',name: 'company-support-create', component: ShipmentIssueListDialog }
            ]
        })
        router.push(`/company/1/orders`);
        const shipment_id = "16141714058381943588";
        const issues = [{
            priority: {
                color: "red"
            },
            content: {
                title: "STAR"
            },
            status: {
                display: 'pending'
            },
            category: {
                display: 'pending'
            }
        }];
        const isDrawerView = false;
        wrapper = mount(ShipmentIssueListDialog, {
            localVue,
            router,
            propsData: { shipment_id, issues, isDrawerView },
            stubs: {
                'open()': RoleModal,
                'close()': RoleModal
            }
        });
    })
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('ShipmentDpTracking renders', async() => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('it will call the onRowClick method', async () => {
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const goToTicketFunction = jest.spyOn(wrapper.vm, 'goToTicket');
        await flushPromises();

        let element = wrapper.find('.link');
        element.trigger('click', '54321');
        await wrapper.vm.$nextTick();

        expect(goToTicketFunction).toHaveBeenCalled();
    }); 
});