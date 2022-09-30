import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import ExtensionReviewList from "./../../../../../pages/extensions/extension-review-list.vue";
import ExtensionReviewPage from "./../../../../../pages/extensions/extension-review.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services//mixmaster-url.service"
import MOCK_DATA from "./fixtures/extension-review.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

describe('Mounted Extension Review Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.EXTENSION_REVIEW(`${MOCK_DATA.extensiondata.items[0]._id}`)).reply(200, MOCK_DATA.extensiondata.items[0]);
        mock.onGet(URLS.ADMIN_EXTENSION_CATEGORIES()).reply(200, MOCK_DATA.categoryData);
        router = new VueRouter({
            routes: [{
                path: '/administrator/extensions/review/:review_id',
                component: ExtensionReviewPage
            }, {
                path: '/administrator/extensions/review',
                component: ExtensionReviewList
            }, ]
        })
        router.push(`/administrator/extensions/review/${MOCK_DATA.extensiondata.items[0]._id}`);
        // router.push('/administrator/extensions/review');
        wrapper = mount(ExtensionReviewPage, {
            localVue,
            router,
        })
        await flushPromises();
    });
    it('exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    });
    it('check extension review page', async () => {
        expect(wrapper.vm.pageLoading).toBeFalsy();
    });
    it('change the category', async () => {
        wrapper.vm.onChangeCategoryL1();
        wrapper.vm.onChangeCategoryL2();
        wrapper.vm.removeSelectedCategory(0, true, 0);
        expect(wrapper.vm.companyId).toBe(1234);
    });
})