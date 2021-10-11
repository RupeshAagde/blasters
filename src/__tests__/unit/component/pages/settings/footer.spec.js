import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import Footer from "./../../../../../pages/settings/footer.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/custom-footer.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

describe('Mounted Footer Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.PLATFORM_CUSTOM_FOOTER()).reply(200, MOCK_DATA);
        mock.onPut(URLS.PLATFORM_CUSTOM_FOOTER(MOCK_DATA._id)).reply(200, MOCK_DATA);
        mock.onPost(URLS.PLATFORM_CUSTOM_FOOTER()).reply(200, MOCK_DATA);
        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/footer',
                component: Footer
            }]
        })
        router.push('/administrator/settings/footer');
        wrapper = mount(Footer, {
            localVue,
            router,
        })
        await flushPromises();
    });
    it('exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })
    it('list footer data', async () => {
        expect(wrapper.vm.title.value).toBe(MOCK_DATA.title)
    })

    it('save data', async () => {
        const saveBtn = wrapper.findComponent({ ref: 'save-btn' });
        saveBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(wrapper.vm.inProgress).toBe(false)
    })

})