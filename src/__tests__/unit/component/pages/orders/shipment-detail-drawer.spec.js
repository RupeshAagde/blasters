import { shallowMount, createLocalVue } from '@vue/test-utils';
import ShipmentDrawer from '@/pages/orders/shipment-detail-drawer.vue';
import VueRouter from 'vue-router';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import axios from 'axios';
import URLS from '@/services/domain.service';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import VALID_ACTIONS from './fixtures/can-shipment-break.json';

let wrapper, router, localVue;
const mock = new MockAdapter(axios);
const shipment = ORDER_LIST_DATA.items[0].shipments[0];
const order_id = 'FY60364D0D01DC690BD6';
const companyId = '1';
const clickToCallDialog = {
    render: () => {},
    methods: {
        open: () => {},
    },
};

const GET_STATUS = {"shipments":{"16141714058381943588":{"status":true,"error":"","message":["Requested change is being performed"]}},"error_shipments":[]}
const POST_DATA = {
    message: "bags active status updated succesfully",
    success: true
}
describe('Shipment Drawer Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [
                {
                    path: '/orders/list/',
                    component: ShipmentDrawer,
                },
            ],
        });

        const validActions = VALID_ACTIONS.valid_actions[shipment.id];

        mock.onGet(URLS.ORDER_DETAILS(companyId)).reply(200, ORDER_LIST_DATA);

        router.push(`/orders/list`);

        wrapper = shallowMount(ShipmentDrawer, {
            localVue,
            router,
            data: function () {
                return {
                    companyId,
                    errorText: undefined,
                    pageLoading: false,
                    inProgress: false,
                    orderData: null,
                    nextDisabled: false,
                    prevDisabled: false,
                    currentIndex: 0,
                    isNew: false,
                    totalShipmentLength: 0,
                    activeShipment: null,
                    status: '',
                };
            },
            stubs: {
                'click-to-call-dialog': clickToCallDialog,
            },
            propsData: { order_id, shipment_id: shipment.id, validActions },
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

    it('on click on prev button', async () => {
        const prevButton = wrapper.findComponent({ ref: 'prev-button' });
        prevButton.vm.$emit('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.prevDisabled).toBe(true);
    });

    it('on click on prev button', async () => {
        const nextButton = wrapper.findComponent({ ref: 'next-button' });
        nextButton.vm.$emit('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.nextDisabled).toBe(true);
    });

    it('navigation new order page', async () => {
        wrapper.vm.naivgateToOrder({preventDefault:()=>{},stopPropagation:()=>{}},ORDER_LIST_DATA.items[0].shipments[0].id)
        await wrapper.vm.$nextTick();
        expect(router.currentRoute.path).toBe('/orders/list');
    })

    // it('open dialog click to call', () => {
    //     wrapper.vm.clickToCall({ reciver: 'call', title: 'click to call' });
    // });

    // it('dialog close', () => {
    //     wrapper.vm.$clickToCallDialogClosed('success')
    // })

    // it('updateShipmentStatus', async () => {
    //     mock.onPost(URLS.ORDER_SHIPMENTS_STATUS_UPDATE(companyId)).reply(200, GET_STATUS);
    //     wrapper.vm.updateShipment()
    //     await wrapper.vm.$nextTick()
    //     mock.onPost(URLS.STORE_PROCESS_SHIPMENTS()).reply(200, POST_DATA)
    // })
});
