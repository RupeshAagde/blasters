'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import ShipmentIssueListDialog from '@/pages/oms/shipment-issue-list-dialog.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// import URLS from '@/services/domain.service';
import flushPromises from "flush-promises";
const mock = new MockAdapter(axios);
let wrapper, router, localVue
const RoleModal = {
    render: () => {},
    methods: {
        open: () => { },
        close: () => { }
    }
}
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
        }]
        const isDrawerView = false
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
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });

    // it('it will call the reportAnIssue method', async () => {
    //     // wrapper.setData({
    //     //     close: () => ''
    //     // })
    //     wrapper.setProps({
    //         isDrawerView: true,
    //     })
    //     const clickEvent = jest.spyOn(wrapper.vm, 'reportAnIssue');
    //     await flushPromises();

    //     let a = wrapper.find('.row-top')
    //     a.vm.$emit('click')
    //     await wrapper.vm.$nextTick();

    //     expect(clickEvent).toHaveBeenCalled();
    // }); 

    // it('it will call the reportAnIssue method when the isDrawerView is false', async () => {
    //     // wrapper.setData({
    //     //     close: () => ''
    //     // });
    //     wrapper.setProps({
    //         isDrawerView: false,
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();

    //     const clickEvent = jest.spyOn(wrapper.vm, 'reportAnIssue');
    //     await flushPromises();

    //     let a = wrapper.find('.row-top')
    //     a.vm.$emit('click')
    //     await wrapper.vm.$nextTick();

    //     expect(wrapper.vm.isDrawerView).toBeFalsy();
    // }); 

    it('it will call the onRowClick method', async () => {
        // wrapper.setData({
        //     close: () => ''
        // })

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        // wrapper.setProps({
        //     isDrawerView: true,
        // })
        const clickEvent = jest.spyOn(wrapper.vm, 'goToTicket');
        await flushPromises();

        let a = wrapper.find('.link')
        a.trigger('click', '54321')
        await wrapper.vm.$nextTick();

        expect(clickEvent).toHaveBeenCalled();
    }); 

    // it('it will call the open method', async () => {
    //     const openMethod = jest.spyOn(wrapper.vm.WrappedComponent.$refs.shipmentIssueList, 'open()');
    //     // const errorSnackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');

    //     const clickEvent = jest.spyOn(wrapper.vm, 'open');
    //     await flushPromises();

    //     wrapper.vm.open()
    //     await wrapper.vm.$nextTick();

    //     expect(openMethod).toHaveBeenCalled();
    // }); 

    // it('it will call the close method', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'close');
    //     await flushPromises();

    //     wrapper.vm.close('oyi')
    //     await wrapper.vm.$nextTick();

    //     expect(clickEvent).toHaveBeenCalled();
    // }); 

});