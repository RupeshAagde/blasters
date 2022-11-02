import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import ExtensionCollection from '@/pages/extensions/extension-collection.vue';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services//mixmaster-url.service"
import MOCK_DATA from "./fixtures/extension-collection.json";
import flushPromises from "flush-promises";


const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

describe('Mounted Extension Review Listing', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.GET_EXTENSION_COLLECTIONS()).reply(200, MOCK_DATA);
        router = new VueRouter({
            routes: [{
                path: '/administrator/extensions/collection',
                component: ExtensionCollection
            }]
        })
        router.push('/administrator/extensions/collection');
        wrapper = mount(ExtensionCollection, {
            localVue,
            router,
        })
        await flushPromises();
    });
    it('Test if page is rendering correctly', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    });
    it('Test if page is rendering correctly with filters', async () => {
        router.push({
            path: '/administrator/extensions/collection',
            query: {
                page_no: 1,
                page_size: 20,
                name: "new",
            }
        })
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.vm.$route.fullPath).toEqual('/administrator/extensions/collection?page_no=1&page_size=20&name=new')
    });

    it('Test if it redirects to extension form correctly', async () => {
        const jumbotronWrapper = wrapper.find('.top-jumbotron')
        jumbotronWrapper.vm.$emit('btnClick')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$route.fullPath).toEqual('/administrator/extensions/collection/create')
    })

    it('Test if pagination is working or not', async () => {
        const searchWrapper = wrapper.find('.extension-list-pagination');
        searchWrapper.vm.$emit('change', { total: 3 });
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.paginationConfig.total).toEqual(3)
    })
})