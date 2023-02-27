'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from "flush-promises";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import InvoiceLabelMenu from '@/pages/oms/invoice-label-menu.vue';

/* Services imports */
import URLS from '@/services/domain.service';

/* Mock imports */
import INVOICE_LABEL_MOCK from './fixtures/invoice-label-menu-mocks.json';
import GET_PUBLIC_URL_MOCK from '@/__tests__/unit/component/pages/oms/fixtures/invoice-label-get-public-url.json';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);
describe('Order/Shipment List Page', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);

        mock.onPost(URLS.GET_PUBLIC_URL()).reply(200, GET_PUBLIC_URL_MOCK);
        
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/get-single-presigned-url', component: InvoiceLabelMenu }
            ]
        });
        router.push(`/company/41/get-single-presigned-url`);
        let toggleMenu = "invoice";
        let shipment = INVOICE_LABEL_MOCK.shipment_prop;
        let viewType = false;
        wrapper = mount(InvoiceLabelMenu, {
            localVue,
            router,
            propsData: {
                toggleMenu, shipment, viewType
            },
            data() {
                return {
                }
            },
            computed: {
                accessDetail: () => INVOICE_LABEL_MOCK.access_detail,
                userinfo: () => INVOICE_LABEL_MOCK.user_info
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

    it('it makes post request to the api calling the getDoucmentUrl method with param(get_type = "download") and also downloads the invoice/label', async () => {
        const getDocumentURLFunction = jest.spyOn(wrapper.vm, 'getDocumentURL');
        jest.spyOn(wrapper.vm, 'downloadSourceFile').mockImplementation(() => jest.fn());
        await flushPromises();

        let element = wrapper.find('.download-invoice-label');
        element.trigger('click', 'invoice_a4', 'download', undefined);
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(getDocumentURLFunction).toHaveBeenCalled();
    }); 
});