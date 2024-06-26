/* Package import */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from "flush-promises";

/* Component import */
import ChangeAddress from '@/pages/oms/shipment-table/change-address-drawer.vue';

/* Mock import */
import SHIPMENT from '../fixtures/shipment.json'

let wrapper, router, localVue;

describe('change-address-drawer', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: 'orders/:orderId/details', name: 'company-order-details-v2', component: ChangeAddress }
            ]
        })
        router.push(`orders/FY63F47BF30DCB3BFB88/details`)
        wrapper = mount(ChangeAddress, {
            localVue,
            router,
            propsData: {
                shipment: SHIPMENT.shipment
            }
        });
        await flushPromises();
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('is a Vue instance', () => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('should change address type', async() => {
        let addressTypeDropdown = wrapper.find('.employee');
        addressTypeDropdown.vm.$emit('input', 'home');
        addressTypeDropdown.vm.$emit('change');
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectedAddressType).toBe('home');
    });

    it('should change name', async() => {
        let nameInput = wrapper.find('.search-input');
        nameInput.vm.$emit('input', 'test');
        nameInput.vm.$emit('change');
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.name).toBe('test');
    });

    it('form validation should pass', async() => {
        await wrapper.setData({email: 'test@test.com'});
        wrapper.vm.onValueChange('email');
        await wrapper.setData({phoneNumber: 9619831977});
        wrapper.vm.onValueChange('phone');
        await wrapper.setData({pincode: 400101});
        wrapper.vm.onValueChange('pincode');
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.validForm).toBe(true);
    });
    
    it('form validation should fail', async() => {
        await wrapper.setData({email: 'testtestcom'});
        wrapper.vm.onValueChange('email');
        await wrapper.setData({phoneNumber: 'test96198319ad'});
        wrapper.vm.onValueChange('phone');
        await wrapper.setData({pincode: 'test'});
        wrapper.vm.onValueChange('pincode');
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.validForm).toBe(false);
    });
});