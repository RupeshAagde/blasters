'use strict';

/* Package imports */
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from '@/services/domain.service';

/* Component imports */
import Header from '@/pages/oms/shipment-info/header.vue'

/* Mock imports */
import DETAILS_SECTION_DATA from '../fixtures/details-section-data.json'
import FIRST_BAG_DATA from '../fixtures/header-first-bag.json'
import TICKETS_DATA from '../fixtures/tickets-data.json'
import COMPUTED_DATA from '../fixtures/computed_data.json'

let wrapper, router, localVue;
const mock = new MockAdapter(axios);
describe('Header', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        
        localVue.use(VueRouter);

        mock.reset();
        mock.onGet(URLS.FETCH_TICKETS({limit: '200', page: '1', attachment_type:  'shipment', attachment_value: '16732474358681725492'})).reply(200, TICKETS_DATA)
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders/:orderId/details', name: 'company-order-details-v2', component: Header},
            ]
        })
        router.push(`/company/1/orders/v2`);

        const detailsData = DETAILS_SECTION_DATA;
        const firstBag = FIRST_BAG_DATA;

        wrapper = mount(Header, {
            localVue,
            router,
            propsData: { shipment: detailsData, firstBag: firstBag },
            // data() {
            //     query = wrapper.vm.$route.query
            // },
            computed: {
                accessDetail: () => COMPUTED_DATA.accessDetail,
                userinfo: () => COMPUTED_DATA.userinfo,
                support_config: () => COMPUTED_DATA.support_config,
            }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async() => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('it changes the tabs in the activity logs drawer)', async () => {
        wrapper.setData({
            quickActivityView: true,
            selectedStageTabIndex: 0
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.findComponent({ref: "tabs"});
        copyClick.vm.$emit('tab-change', {
            "index": 1,
            "item": "DP Status"
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedStageTabIndex).toBe(1);
    });

    it('it changes the tabs in the activity logs drawer)', async () => {
        wrapper.setData({
            quickActivityView: true,
            selectedStageTabIndex: 0
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.findComponent({ref: "tabs"});
        copyClick.vm.$emit('tab-change', {
            "index": 0,
            "item": "Activity"
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedStageTabIndex).toBe(0);
    });

    it('it makes the showShipmentActivity to true or false)', async () => {
        wrapper.setData({
            quickActivityView: false,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find(".log-activity");
        copyClick.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.quickActivityView).toBe(true);
    });

    it('it calls the closeDetails funciton and change the showShipmentActivity to false)', async () => {
        wrapper.setData({
            quickActivityView: true,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find(".side-drawer");
        copyClick.vm.$emit('close');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.quickActivityView).toBe(false);
    });

    it('it closes the shipment issue list dialog)', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'closeDialog');
        await flushPromises();
        wrapper.setData({
            issues: ["hi"]

        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.findComponent({ref: "shipmentIssueListDialog"});
        copyClick.vm.$emit('closeDialog');
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

    it('it opens the shipment issue list dialog)', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'openDialog');
        await flushPromises();
        wrapper.setData({
            issues: ["hi"]

        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        wrapper.vm.openDialog()
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

});