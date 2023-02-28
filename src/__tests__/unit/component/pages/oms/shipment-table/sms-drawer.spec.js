/* Package import */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from "flush-promises";

/* Component import */
import SmsDrawer from '@/pages/oms/shipment-table/sms-drawer.vue';

/* Mock import */
import MOCK_SHIPMENT_DATA from '../fixtures/shipment.json';
import MOCK_SMS_DATA from '../fixtures/sms-drawer-data.json';

/* Service import */
import URLS from '@/services/domain.service.js';


const mock = new MockAdapter(axios);
let wrapper, router, localVue;

describe('SMS Drawer', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: 'orders/:orderId/details', name: 'company-order-details-v2', component: SmsDrawer }
            ]
        });
        mock.onPost(URLS.SEND_SMS()).reply(200, MOCK_SMS_DATA.response);
        router.push(`orders/FY63F47BF30DCB3BFB88/details`);
        wrapper = mount(SmsDrawer, {
            localVue,
            router,
            propsData: {
            fullName: 'Test User',
            orderId: 'FY63F47BF30DCB3BFB88',
            shipmentId: MOCK_SHIPMENT_DATA.placed.shipment_id,
            bagId: MOCK_SHIPMENT_DATA.placed.bags[0].bag_id.toString(),
            brandName: MOCK_SHIPMENT_DATA.placed.bags[0].item.brand,
            amountPaid: MOCK_SHIPMENT_DATA.placed.order.prices.amount_paid.toString(),
            paymentMode: 'COD',
            number: ['+123456789', '+987654321']
            }
        });
        await flushPromises();
    })

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('renders two dropdowns', () => {
        expect(wrapper.findAll('.dropdown')).toHaveLength(2);
    });

    it('selects SMS template and recipient', async () => {
        await wrapper.findComponent({ref: 'templateDropdown'}).vm.$emit('input', 'delayed_shipment');
        await wrapper.findComponent({ref: 'recipientDropdown'}).vm.$emit('input', '+123456789');
        await wrapper.findComponent({ref: 'templateDropdown'}).vm.$emit('change');
        expect(wrapper.vm.selectedTemplate).toBe('delayed_shipment');
        expect(wrapper.vm.selectedNumber).toBe('+123456789');
    })

    it("dropdown outside click sms-drawer", async () => {
        let dropdownDiv = wrapper.find('.dropdown');
        dropdownDiv.trigger('focus');
        dropdownDiv.trigger('blur');
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(dropdownDiv.findComponent({ name: 'nitrozen-dropdown'}).vm.showOptions).toBe(false);
    });

    it('generate all sms templates', async() => {
        let smsTemplateDropdown =  wrapper.findComponent({ref: 'templateDropdown'});
        await smsTemplateDropdown.vm.$emit('input', 'custom_delayed_shipment');
        expect(wrapper.vm.selectedTemplate).toBe('custom_delayed_shipment');
        await smsTemplateDropdown.vm.$emit('input', 'not_reachable');
        expect(wrapper.vm.selectedTemplate).toBe('not_reachable');
        await smsTemplateDropdown.vm.$emit('input', 'shipment_rto');
        expect(wrapper.vm.selectedTemplate).toBe('shipment_rto');
        await smsTemplateDropdown.vm.$emit('input', 'account_details');
        expect(wrapper.vm.selectedTemplate).toBe('account_details');
        await smsTemplateDropdown.vm.$emit('input', 'refund');
        expect(wrapper.vm.selectedTemplate).toBe('refund');
        await wrapper.vm.$nextTick();
    });

    it('send sms', async () => {
        let smsTemplateDropdown =  wrapper.findComponent({ref: 'templateDropdown'});
        await smsTemplateDropdown.vm.$emit('input', 'delayed_shipment');
        await wrapper.findComponent({ref: 'recipientDropdown'}).vm.$emit('input', '+123456789');
        wrapper.vm.sendSmsToCustomer();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedTemplate).toBe('delayed_shipment');
    });
});
