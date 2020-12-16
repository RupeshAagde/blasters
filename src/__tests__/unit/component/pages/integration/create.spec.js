import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import IntegrationCreate from "./../../../../../pages/integration/create.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/list-mock.json";
import COMPANY_MOCK_DATA from './fixtures/company-list.json';
const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

describe('Mounted Create Integartion Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.INTEGRATION_BY_ID('5e5608bf4265cf7198d1e58f')).reply(200, MOCK_DATA.docs[1]);
        mock.onPut(URLS.SAVE_INTEGRATION('5e5608bf4265cf7198d1e58f')).reply(200, MOCK_DATA.docs[1]);
        mock.onPost(URLS.ADD_INTEGRATION()).reply(200, MOCK_DATA.docs[1]);
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(200, COMPANY_MOCK_DATA);
        router = new VueRouter({
            routes: [{
                path: '/administrator/integrations/edit/:integrationId',
                component: IntegrationCreate
            }]
        })
        router.push('/administrator/integrations/edit/5e5608bf4265cf7198d1e58f');
        wrapper = mount(IntegrationCreate, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
    });
    it('exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot()
    })
    it('list data', async () => {
        expect(wrapper.vm.name.value).toBe('x0-2')
    })
    it('save form', async () => {
        wrapper.vm.saveForm();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.inProgress).toBe(false);
    })
})