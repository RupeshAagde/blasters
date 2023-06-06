import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import Index from '@/pages/oms/credit-notes-pos/index.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from "flush-promises";
import Shipment from './shipment.json';
import URLS from '@/services/domain.service';
import MOCK_ORDER_RESPONSE_DATA from './fixtures.json';
import MOCK_REASONS_DATA from './reasons.json';

let localVue;
const mock = new MockAdapter(axios);
let wrapper, router
const companyId = '61';
describe('index', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.ORDER_DETAILS_V2(companyId, null, { order_id: 'FY64250E080E8364A438' })).reply(200, MOCK_ORDER_RESPONSE_DATA);
        mock.onGet(URLS.FETCH_REASONS('16801500257931651268', '698659', 'handed_over_to_customer')).reply(200, MOCK_REASONS_DATA);
        mock.onGet(URLS.FETCH_REASONS('16849522862211394684', '698658', 'return_accepted')).reply(200, MOCK_REASONS_DATA);
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders/:orderId/details', name: 'company-order-details-v2', component: Index }
            ]
        })
        router.push(`/company/61/orders/details`) ;
        router.push({
            name: 'company-order-details-v2',
            params: {
                orderId: 'FY64250E080E8364A438',
                company_id:'61'
            },
            query: {
                shipmentId: '16801500257931651268',
            }
        });
        wrapper = mount(Index, {
            localVue,
            router,
            propsData: {
                status: 'handed_over_to_customer',
                shipmentId: '16849522862211394684',
            },
            data() {
                return {
                    showReturnPanel:true,
                    shipment:Shipment
                }
            },
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
})