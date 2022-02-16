import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import CreateCustomPage from "./../../../../../pages/settings/page-editor/create.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/custom-page.json";
//import CUSTOM_PAGE_MOCK_DATA from "./fixtures/custom-pages.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

const pageCssOptions= [
    {
        key: 'width',
        value: '',
        unit: 'px',
        units: [
            {
                text: 'px',
                value: 'px',
            },
            { text: '%', value: '%' },
        ],
    },
]

describe('Mounted edit custom Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.PLATFORM_EDIT_CUSTOM_PAGES('fynd-test-markdown-page')).reply(200, MOCK_DATA.editdata);
        //mock.onGet(URLS.PLATFORM_EDIT_CUSTOM_PAGES()).reply(200, MOCK_DATA.editdata);
        mock.onPut(URLS.PLATFORM_EDIT_CUSTOM_PAGES('614021a58a20d1811ea2f6b6')).reply(200, MOCK_DATA.editdatasave);
        mock.onPut(URLS.PLATFORM_PUBLISHED('fynd-test-markdown-page')).reply(200, MOCK_DATA.editdata);
        // mock.onGet(URLS.PLATFORM_CUSTOM_PAGES()).reply(200, CUSTOM_PAGE_MOCK_DATA);
        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/pages/:pagetype/:slug/edit',
                component: CreateCustomPage,
                name: 'edit-custom'
            }]
        })
        router.push('/administrator/settings/pages/rawhtml/fynd-test-markdown-page/edit');
        wrapper = mount( CreateCustomPage , {
            localVue,
            router,
        })
        await flushPromises();

       
        
    });
    it('exists wrapper and div', async () => {

    
        
        await flushPromises();
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();

    })
    // it('edit mount', async () => {
    //     await flushPromises();
    //     wrapper.vm.pageCssOptions = pageCssOptions;
    //     wrapper.vm.meta = MOCK_DATA.formdata.meta;
    //     wrapper.vm.tags = MOCK_DATA.formdata.tags;
    //     wrapper.vm.tags = MOCK_DATA.formdata.tags;


    // })
    it('edit save', async ()=>{
        wrapper.vm.content= MOCK_DATA.formdata.content[0].value;

        await flushPromises();
        const saveBtn = wrapper.find('#actions');
        expect(saveBtn.exists()).toBe(true)
        saveBtn.trigger('click')
        

    })
    it('create publish', async ()=>{
        wrapper.vm.content= MOCK_DATA.formdata.content[0].value;

        await flushPromises();
        const createBtn = wrapper.find('#actions');
        expect(createBtn.exists()).toBe(true)
        createBtn.trigger('click')
        

    })
    it('publish', async ()=>{
        await flushPromises();
        const publishBtn = wrapper.find('#publish');
        expect(publishBtn.exists()).toBe(true)
        publishBtn.vm.$emit('change')
    })
    it('input chip', async () => {
        await flushPromises();

        const chipFocus = wrapper.find('#chipFocus');
        expect(chipFocus.exists()).toBe(true)
        chipFocus.trigger('click');
        wrapper.vm.chipInput = 'name';

      

        const chipBtn = wrapper.find('#chipInput');
        expect(chipBtn.exists()).toBe(true)
        chipBtn.trigger('blur');

        
    })


    

})

describe('create page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onPost(URLS.PLATFORM_CUSTOM_PAGES()).reply(200, MOCK_DATA.editdata);
       
        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/pages/create/:pagetype',
                component: CreateCustomPage,
                name: 'edit-custom'
            }]
        })
        router.push('/administrator/settings/pages/rawhtml/create');
        wrapper = mount( CreateCustomPage , {
            localVue,
            router,
        })
        await flushPromises();

       
        
    });
    it('exists wrapper and div and mount', async () => {

        await flushPromises();
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();

        wrapper.vm.content= MOCK_DATA.formdata.content[0].value;

        await flushPromises();
        const createBtn = wrapper.find('#actions');
        createBtn.trigger('click')

    })
    it('create duplicate err', async () => {

        await flushPromises();
    

        wrapper.vm.content= MOCK_DATA.formdata.content[0].value;
        wrapper.vm.slug.value= MOCK_DATA.formdata.slug ;
        wrapper.vm.name.value= MOCK_DATA.formdata.title;

        await flushPromises();
        const createBtn = wrapper.find('#actions');
        createBtn.trigger('click')

    })

})