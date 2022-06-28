'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import ShipmentQCDialog from '@/pages/orders/shipment-qc-dialog.vue';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import VueRouter from 'vue-router';
import { NitrozenButton } from '@gofynd/nitrozen-vue';

let wrapper, router, localVue;
const mock = new MockAdapter(axios);

const ShipmentQCDialogStub = {
    render: () => {},
    methods: {
        open: () => {}
    }
}

describe('Shipment QC Dialog', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: ShipmentQCDialog }
            ]
        });
        router.push(`/orders/list/`);
        wrapper = mount(ShipmentQCDialog, {
            localVue,
            router,
            // stubs: {
            //     'shipmentQC': ShipmentQCDialogStub
            // }
        });
        wrapper.vm.open();
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('should close the modal when the confirm button is closed', () => {
        let closeMethod = jest.spyOn(wrapper.vm, 'close');
        
        let element = wrapper.findComponent(NitrozenButton);
        element.vm.$emit('click');
        // console.log("element:   ", element);

        // expect(2+2).toBe(5);
        expect(closeMethod).toBeCalled();
    })
})