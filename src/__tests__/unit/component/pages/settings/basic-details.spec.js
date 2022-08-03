import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import BasicDetailsPage from "./../../../../../pages/settings/basic-details.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/basic-details.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

describe('Mounted edit custom Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.PLATFORM_BASIC_DETAILS()).reply(200, MOCK_DATA);
        mock.onPut(URLS.PLATFORM_BASIC_DETAILS_UPDATE()).reply(200, MOCK_DATA);
        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/basic',
                component: BasicDetailsPage,
            }]
        })
        router.push('/administrator/settings/basic');
        wrapper = mount(BasicDetailsPage , {
            localVue,
            router,
        })
        await flushPromises();
    });
    it('exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();

    })
    it('edit save', async ()=>{
        const saveBtn = wrapper.findComponent({ ref: 'save-btn' });
        saveBtn.vm.$emit('click');
        await flushPromises();
        expect(wrapper.vm.pageLoading).toBe(false)
    })

})