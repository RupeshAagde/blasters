import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import ExtensionCollectionForm from '@/pages/extensions/extension-collection-create.vue';
import ItemDrawer from '@/pages/extensions/item-drawer.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import { beforeEach, expect, it, jest } from '@jest/globals';
import EXTENSION_MOCK_DATA from "./fixtures/extension-list.json";
import CATEGORY_MOCK_DATA from "./fixtures/category.json";
import flushPromises from 'flush-promises';
import URLS from '@/services//mixmaster-url.service'
import COLLECTION_DATA from './fixtures/collection_data.json';

let localVue;
let wrapper;
let drawerWrapper;
let router;
const mock = new MockAdapter(axios);


describe('Extension List', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: `/administrator/extensions/collection/create`, component: ExtensionCollectionForm }
            ]
        });

        router.push({
            path: `/administrator/extensions/collection/create`
        });
        // mock.onGet(URLS.EXTENSION_SECTION_DATA()).reply(200, MOCK_DATA);
        mock.onGet(URLS.PUBLIC_EXTENSIONS()).reply(200, EXTENSION_MOCK_DATA);
        mock.onGet(URLS.PUBLIC_EXTENSION_CATEGORIES()).reply(200, CATEGORY_MOCK_DATA);
        mock.onGet(URLS.CHECK_DUPLICATE_SLUG('test-collection')).reply(200, CATEGORY_MOCK_DATA);
        mock.onPost(URLS.SAVE_EXTENSION_COLLECTION()).reply(200, { message: "Success" });
        mock.onPut(URLS.UPDATE_EXTENSION_COLLECTION('623847d0ec3c4b10b1f5fed6')).reply(200, { message: "Success" });
        wrapper = mount(ExtensionCollectionForm, {
            localVue,
            router,
        });
        drawerWrapper = mount(ItemDrawer, {
            localVue,
            router,
        });
        await flushPromises();
    });

    it('Collection create form should render properly', () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
    });
    it('Test whether the name changes on input', async () => {
        const nameInput = wrapper.find('.collection-name');
        nameInput.vm.$emit('input', "Test Collection")
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.collection_data.name).toEqual("Test Collection");
    })
    it('Test whether the slug changes and generates correctly', async () => {
        const nameInput = wrapper.find('.collection-slug');
        nameInput.vm.$emit('input', "Test Collection")
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.collection_data.slug).toEqual("test-collection");

        nameInput.vm.$emit('blur', "test-collection")
        await wrapper.vm.$nextTick();
    })
    it('Test whether item-drawer opens with the data and closes with the selections', async () => {
        const drawerInput = wrapper.find('.save-btn');
        drawerInput.vm.$emit('click')
        await wrapper.vm.$nextTick();
        const extensionCard = drawerWrapper.find('.extension-item-0');
        extensionCard.vm.$emit('click', true)
        await drawerWrapper.vm.$nextTick();
        expect(drawerWrapper.vm.extensions_selected).toHaveLength(0);
        expect(wrapper.vm.showExtensionModal).toEqual(true);

        const drawerMain = wrapper.find('.item-drawer-main');
        drawerMain.vm.$emit('onAddExtensions', [])
        await drawerMain.vm.$nextTick();
        expect(wrapper.vm.showExtensionModal).toEqual(false);

    })
    it('It should change the category filter correctly for all', async () => {
        const filterWrapper = drawerWrapper.find('.category_filter_l1-0');
        filterWrapper.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(drawerWrapper.vm.query.l1).toBeFalsy()
        expect(drawerWrapper.vm.query).toBeTruthy()
    })
    it('It should change the category filter correctly for L1', async () => {
        const filterWrapper = drawerWrapper.find('.category_filter_l1-1');
        filterWrapper.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(drawerWrapper.vm.query.l1).toBeTruthy()
        expect(drawerWrapper.vm.query).toBeTruthy()
    })
    it('It should change the category filter correctly for L2', async () => {
        const filterWrapper = drawerWrapper.find('.l2-radio-1');
        filterWrapper.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(drawerWrapper.vm.query.l1).toBeTruthy()
        expect(drawerWrapper.vm.query).toBeTruthy()
    })

    it('It should change the page correctly', async () => {
        const filterWrapper = drawerWrapper.find('.item-pagination');
        filterWrapper.vm.$emit('change', { current: 1, limit: 20 });
        await wrapper.vm.$nextTick();
        expect(drawerWrapper.vm.paginationInfo.page_no).toBe(1)
    })

    it('It should change the price filter correctly', async () => {
        const filterWrapper = drawerWrapper.find('.price-filter-0');
        filterWrapper.vm.$emit('input', true);
        await wrapper.vm.$nextTick();
        expect(drawerWrapper.vm.priceSlug).toHaveLength(1)
        filterWrapper.vm.$emit('input', true);
        await wrapper.vm.$nextTick();
        expect(drawerWrapper.vm.priceSlug).toHaveLength(2)
    })

    // it('It should remove the filter correctly', async () => {
    //     wrapper.vm.slugsL1 = ['test1', 'test2']
    //     const filterWrapper = drawerWrapper.find('.nitrozen-icon');
    //     filterWrapper.vm.$emit('click', true);
    //     await wrapper.vm.$nextTick();
    // })

    it('It should save the form correctly', async () => {
        const saveButton = wrapper.find('.save-form-button');
        let checkRequiredFields = jest.spyOn(wrapper.vm, 'checkRequiredFields');
        saveButton.vm.$emit('click');
        await wrapper.vm.$nextTick();
        expect(checkRequiredFields).toBeCalled()

        wrapper.vm.$set(wrapper.vm, 'collection_data', COLLECTION_DATA)
        saveButton.vm.$emit('click');
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$route.fullPath).toBe('/administrator/extensions/collection');
    })
    it('Should update the form correctly', async () => {
        const collection_wrapper = mount(ExtensionCollectionForm, {
            computed: {
                collection_id: () => COLLECTION_DATA._id
            },
            localVue,
            router,
        });
        const saveButton = collection_wrapper.find('.save-form-button');
        collection_wrapper.vm.$set(collection_wrapper.vm, 'collection_data', COLLECTION_DATA)
        saveButton.vm.$emit('click');
        await collection_wrapper.vm.$nextTick();
        await collection_wrapper.vm.$nextTick();
        await collection_wrapper.vm.$nextTick();
        await collection_wrapper.vm.$nextTick();
        await collection_wrapper.vm.$nextTick();
        expect(collection_wrapper.vm.$route.fullPath).toBe('/administrator/extensions/collection');
    })

    // it('', async () => {
    //     drawerWrapper.vm.$set(drawerWrapper.vm, 'slugsL1', { display: 'testL1', slug: 'newl1' })
    //     const crossElement = drawerWrapper.find('.cross-0')
    //     console.log('>> crossElement', crossElement);
    //     const x = drawerWrapper.vm.getChipsData();
    //     console.log('>> x', x);
    // })
})