import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import Navbar from "./../../../../../pages/settings/navbar.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/navbar.json";
import CUSTOM_PAGE_MOCK_DATA from "./fixtures/custom-pages.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

describe('Mounted Navbar Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.PLATFORM_NAVBAR()).reply(200, MOCK_DATA);
        mock.onGet(URLS.PLATFORM_DEFAULT_NAVBAR()).reply(200, MOCK_DATA);
        mock.onPut(URLS.PLATFORM_NAVBAR()).reply(200, MOCK_DATA);
        mock.onGet(URLS.PLATFORM_CUSTOM_PAGES()).reply(200, CUSTOM_PAGE_MOCK_DATA);
        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/navbar',
                component: Navbar
            }]
        })
        router.push('/administrator/settings/navbar');
        wrapper = mount(Navbar, {
            localVue,
            router,
        })
        await flushPromises();
    });
    it('exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })
    it('list navbar data', async () => {
        expect(wrapper.vm.navbar.length).toBe(5)
        expect(wrapper.vm.navbar.length).toBe(5)
    })

    it('add new data', async () => {
        const addNewBtn = wrapper.findComponent({ ref: 'add-new' });
        addNewBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        wrapper.vm.navbarTitle.value = 'test'
        wrapper.vm.selectedPage.value = '/p/test'
        const saveBtn = wrapper.findComponent({ ref: 'save-btn' });
        saveBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.navbar.length).toBe(6)
    })

    it('edit data', async () => {
        const addNewBtn = wrapper.findComponent({ ref: 'edit-0' });
        addNewBtn.trigger('click');
        await wrapper.vm.$nextTick();
        wrapper.vm.navbarTitle.value = 'test'
        wrapper.vm.isExtenalLink = true
        wrapper.vm.extenalLink.value = 'https://www.google.com/'
        const saveBtn = wrapper.findComponent({ ref: 'save-btn' });
        saveBtn.vm.$emit('click');
        expect(wrapper.vm.navbar.length).toBe(5)
    })

    it('delete data', async () => {
        const deleteBtn = wrapper.findComponent({ ref: 'delete-0' });
        deleteBtn.trigger('click');
        await wrapper.vm.$nextTick();
        const deleteDataBtn = wrapper.findComponent({ ref: 'delete-btn' });
        deleteDataBtn.vm.$emit('click');
        expect(wrapper.vm.navbar.length).toBe(4)
    })

    it('switch default data', async () => {
        const defaultBtn = wrapper.findComponent({ ref: 'switch-default' });
        defaultBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        const saveDefault = wrapper.findComponent({ ref: 'save-default-btn' });
        saveDefault.vm.$emit('click');
        await flushPromises();
        expect(wrapper.vm.inProgress).toBe(false)
    })

})