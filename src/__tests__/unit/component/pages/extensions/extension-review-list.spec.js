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
let wrapper , router

describe('Mounted Extension Review Listing', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.EXTENSION_REVIEW()).reply(200, MOCK_DATA.extensiondata);
        router = new VueRouter({
            routes: [{
                path: '/administrator/extensions/revieew',
                component: ExtensionReviewList 
            },
            {
                path: '/administrator/extensions/review/:review_id',
                component: ExtensionReviewPage 
            }]
        })
        router.push('/administrator/extensions/review');
        router.push(`/administrator/extensions/review/${MOCK_DATA.extensiondata.items[0]._id}`);
        wrapper = mount(ExtensionReviewList  , {
            localVue,
            router,
        })
        await flushPromises();  
    });
    it('exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    });
    it('check extension review list length', async () => {
      expect(wrapper.vm.extensionList.length).toBeGreaterThan(1);
    });
    it('status filter change', async () => {
        const filterDropdown = wrapper.findComponent({ ref: 'filter-dropdown' });
        filterDropdown.vm.$emit('change');
        await flushPromises();
        expect(wrapper.vm.extensionList.length).toBeGreaterThan(1);

        wrapper.vm.searchText = "news"
        const searchInput = wrapper.findComponent({ ref: 'search-box' });
        searchInput.vm.$emit('input');
        await flushPromises();
        expect(wrapper.vm.extensionList.length).toBeGreaterThan(1);
    });

    // it('pagination change', async () => {
    //     const pagination = wrapper.findComponent({ ref: 'ext-paginagtion' });
    //     pagination.vm.$emit('change');
    //     await flushPromises();
    //     expect(wrapper.vm.extensionList.length).toBeGreaterThan(1);
    // });

    it('redirect to review details', async () => {
        const redirectDiv = wrapper.findComponent({ ref: 'extension-0' });
        redirectDiv.vm.$emit('click');
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$route.fullPath).toBe(`/administrator/extensions/review/${MOCK_DATA.extensiondata.items[0]._id}`);
    });
})