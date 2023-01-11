import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import HomePage from "./../../../../../pages/settings/home-page.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/home-page.json";
import CUSTOM_PAGE_MOCK_DATA from "./fixtures/custom-pages.json";
import flushPromises from "flush-promises";
import { console } from "window-or-global";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper

describe('Mounted HomePage', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.PLATFORM_HOME_PAGE()).reply(200, MOCK_DATA);
        mock.onPut(URLS.PLATFORM_HOME_PAGE()).reply(200, MOCK_DATA);
        mock.onGet(URLS.PLATFORM_CUSTOM_PAGES()).reply(200, CUSTOM_PAGE_MOCK_DATA);
        wrapper = mount(HomePage, {
            localVue,
        })
        await flushPromises();
    });
    it('exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })
    it('list homepage data', async () => {
        wrapper.vm.open()
        await flushPromises();
        expect(wrapper.vm.isCustomHomePage).toBe(true)
    })
    it('save data', async () => {
        wrapper.vm.open({title: 'Features Page', key: 'features'})
        await flushPromises();
        let showSuccess = jest.spyOn(wrapper.vm.$snackbar.global, "showSuccess");
        const saveBtn = wrapper.findComponent({ ref: 'save-btn' });
        saveBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(showSuccess).toHaveBeenCalled();
    })
    it('default data', async () => {
        wrapper.vm.open()
        await flushPromises();
        let showSuccess = jest.spyOn(wrapper.vm.$snackbar.global, "showSuccess");
        const defaultBtn = wrapper.findComponent({ ref: 'default-btn' });
        defaultBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(showSuccess).toHaveBeenCalled();
    })

})